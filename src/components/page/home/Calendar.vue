<template>
  <div class="calendar-box" ref="calendarBox">
    <!-- <a-button type="primary" class="add-process" @click="addProcess"> <a-icon type="plus" />添加计划类型</a-button> -->
    <div class="flex">
      <a-button type="primary" class="add-process" @click="addWork()">
        <a-icon type="plus" />添加项目
      </a-button>
      <div class="flex process-list" v-show="processList.length">
        <span>计划类型：</span>
        <div
          class="process-item pos-rel"
          :class="'process-' + process.id"
          v-for="(process, key) in processList"
          :key="key"
          @mouseenter="enterType(process)"
          @mouseleave="leaveType(process)"
        >
          <span class="bg-color pos-abs"></span>
          <span>{{ process.name }}</span>
        </div>
      </div>
    </div>
    <div class="richeng-box flex pos-rel" v-show="loaded">
      <div class="richeng-tbody">
        <div class="flex richeng-flex">
          <div class="flex-th flex-item-1 pos-rel">
            <span>项目</span>
          </div>
          <!-- <div class="flex-th flex-item-2">创建人</div>
          <div class="flex-th flex-item-3">
            <span>状态</span>
          </div>-->
        </div>
        <div class="flex richeng-flex" v-for="(work, key) in list" :key="key">
          <div class="flex-td flex-item-1 text-overflow pos-rel">
            <span
              class="flex-item-edit pos-abs"
              @click="editWork(work, 2)"
              :title="work.name"
            >{{ work.name }}</span>
            <span class="flex-item-add pos-abs" @click="addWork(work)">
              <a-icon title="新增计划" type="plus" />
            </span>
          </div>
        </div>
      </div>
      <div class="richeng-tbody richeng-tbody-2 pos-rel">
        <div class="richeng-flex-2" ref="box">
          <div class="pos-rel" ref="canvasSource" :style="itemStyle">
            <div class="flex-td flex-item-4 pos-rel">
              <div class="flex richeng-days">
                <div
                  class="flex-item-type pos-rel"
                  :class="getWeekdayClass(date)"
                  v-for="(date, key) in days"
                  :key="key"
                >
                  <div class="pos-abs flex-item-days-box">
                    <span class="pos-abs flex-item-month">{{ getMonthTxt(date.month) }}</span>
                    <span class="flex-item-day">{{ date.day }}</span>
                    <span class="pos-abs flex-item-weekday">{{ getWeekdayTxt(date.weekday) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex-td flex-item-4 pos-rel"
              :class="getHoverDay(showHoverDay, work)"
              v-for="(work, key) in list"
              :key="key"
            >
              <div class="flex richeng-days">
                <div class="flex-item-days pos-rel" v-for="(date, keys) in work.days" :key="keys">
                  <div class="pos-abs flex-item-type-box flex">
                    <div
                      v-for="(typeObj, keys2) in date.type"
                      :key="keys2"
                      :class="'process-'+typeObj.type"
                      class="flex-item-type-item pos-rel"
                      @mouseenter="enterDay(typeObj, work)"
                      @mouseleave="leaveDay"
                    >
                      <div
                        :class="{hover: showHover === typeObj.item.id}"
                        class="pos-abs bg-color"
                        @click="editWork(work, 1, typeObj.item)"
                      ></div>
                    </div>
                    <div class="pos-abs event-box flex">
                      <div class="event-item" v-for="(event, keyss) in date.event" :key="keyss">
                        <a-icon
                          type="heart"
                          :title="event.name"
                          @click="eventDetail(work, date, event)"
                        />
                      </div>
                      <div></div>
                      <div class="event-add" title="添加事件" @click="eventAdd(work, date)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="scroll-btn" v-show="showScrollBtn">
          <a-icon @click="scrollLeft()" title="回到今天" type="reload" />
        </div>
      </div>
      <div class="richeng-canvas pos-abs" :style="canvasStyle">
        <div ref="canvasBox" @click="scrollLeftTo($event)"></div>
        <div
          class="richeng-canvas-bar pos-abs"
          :style="canvasBarStyle"
          @mousedown="scrollDown($event)"
        ></div>
      </div>
      <div
        class="scroll-mask"
        v-show="scrollData.show"
        @mouseup="scrollUp($event)"
        @mousemove="scrollMove($event)"
      ></div>
    </div>
    <a-modal :title="modalTitle" :visible="visible" @cancel="handleCancel" :footer="null">
      <component
        v-bind:is="modal"
        :parent="parent"
        :work="work"
        :item="item"
        :processList="processList"
        :eventDate="eventDate"
        :eventDetails="eventDetails"
      ></component>
    </a-modal>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import AddWorkVue from "../calendar/AddWork.vue";
import EditWorkVue from "../calendar/EditWork.vue";
import AddItemVue from "../calendar/AddItem.vue";
import EditItemVue from "../calendar/EditItem.vue";
import AddProcessVue from "../calendar/AddProcess.vue";
import AddEventVue from "../calendar/AddEvent.vue";
import EditEventVue from "../calendar/EditEvent.vue";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      visible: false,
      modal: null,
      modalTitle: "",
      work: null,
      item: null,
      parent: null,
      list: [],
      days: [],
      processList: [],
      showHover: "",
      showHoverItem: null,
      showHoverDay: "",
      stime: null,
      eventDate: null,
      eventDetails: null,
      loaded: false,
      showScrollBtn: false,
      isHoverDay: false,
      calendarBoxWidth: 0,
      scrollData: {
        show: false,
        sx: 0,
        ex: 0,
        left: 0,
      },
    };
  },
  created() {
    this.parent = this;
    window.vl = this;
    this.getHead();
    this.getData(1);
  },
  mounted() {
    setTimeout(() => {
      this.initRect();
    }, 0);
  },
  computed: {
    itemStyle() {
      return {
        width: this.days.length * 70 + "px",
      };
    },
    canvasStyle() {
      let _width = this.days.length * 70;
      let _height = (this.list.length + 1) * 54;
      let width = this.calendarBoxWidth;
      return {
        width: width + "px",
        height: (_height * width) / _width + "px",
      };
    },
    scale() {
      let _width = this.days.length * 70;
      let width = this.calendarBoxWidth;
      return width / _width;
    },
    canvasBarStyle() {
      let left = this.scrollData.left * this.scale;
      let width = (this.calendarBoxWidth - 160) * this.scale;
      if (left < 0) {
        left = 0;
      } else if (left > this.calendarBoxWidth - width) {
        left = this.calendarBoxWidth - width;
      }
      return {
        left: left + "px",
        width: width + "px",
      };
    },
  },
  methods: {
    // 获取表头数据
    getHead() {
      const url = "json/processList.json";
      this.axios.get(url).then((res) => {
        res = res.data
        this.processList = res.list;
      });
    },
    // 获取项目数据
    getData(init) {
      const url = "json/projectList.json";
      this.axios.get(url).then((res) => {
        res = res.data
        this.initData(res.list);
        if (init) {
          setTimeout(() => {
            this.scrollLeft();
          }, 0);
        }
        setTimeout(() => {
          this.initCanvas();
        }, 1e3);
      });
    },
    // 初始化数据
    initData(list) {
      let ntime = new Date();
      let stime = ntime;
      let etime = ntime;
      // 计算最大最小时间
      list.forEach((ele) => {
        ele.process_list.forEach((el) => {
          let interval_list = el.interval_list;
          if (interval_list.id) {
            let time_start = new Date(
              interval_list.start_time_day + " 00:00:00"
            );
            if (stime.getTime() > time_start.getTime()) {
              stime = time_start;
            }
            let time_end = new Date(interval_list.end_time_day + " 00:00:00");
            if (etime.getTime() < time_end.getTime()) {
              etime = time_end;
            }
          }
        });
      });
      let days = [];
      // 结束时间延后15天
      stime = new Date(stime.getTime() - 5 * 24 * 3600 * 1000);
      etime = new Date(etime.getTime() + 20 * 24 * 3600 * 1000);
      //记录开始事件
      this.stime = stime;
      let t1 = stime.getTime();
      let t0 = ntime.getTime();
      let t2 = etime.getTime();
      let temp = 24 * 3600 * 1000;
      let dayIndex = 0;
      // 按天记录时间
      for (let i = t1; i <= t2; i += temp) {
        let date = new Date(i);
        let item = {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          weekday: date.getDay(),
          select: false,
          index: dayIndex,
          type: [],
          event: [],
        };
        days.push(item);
        dayIndex++;
      }
      list.forEach((ele) => {
        // 每个项目分别记录时间-天
        ele.days = JSON.parse(JSON.stringify(days));
        ele.process_list.forEach((el) => {
          let interval_list = el.interval_list;
          if (interval_list.id) {
            let time_start = new Date(
              interval_list.start_time_day + " 00:00:00"
            ).getTime();
            let time_end = new Date(
              interval_list.end_time_day + " 00:00:00"
            ).getTime();
            let temp = 24 * 3600 * 1000;
            let i = 0;
            for (let time = time_start; time <= time_end; time += temp) {
              let date = new Date(time);
              let year = date.getFullYear();
              let month = date.getMonth();
              let day = date.getDate();
              let item = ele.days.find((e) => {
                return e.year === year && e.month === month && e.day === day;
              });
              item.type.push({
                type: interval_list.process_id,
                process_id: interval_list.process_id,
                project_id: interval_list.project_id,
                index: i,
                item: el,
              });
              i++;
            }
          }
        });
        ele.event_list.forEach((event) => {
          let date = new Date(event.time_day + " 00:00:00");
          let year = date.getFullYear();
          let month = date.getMonth();
          let day = date.getDate();
          let item = ele.days.find((e) => {
            return e.year === year && e.month === month && e.day === day;
          });
          item.event.push(event);
        });
      });
      this.days = days;
      this.loaded = true;
      this.list = list;
    },
    // 格式化数字
    foamatNum(number, len = 2) {
      number = "0000000000" + number;
      return number.substr(number.length - 2, 2);
    },
    // 获取中文月份
    getMonthTxt(month) {
      let txt = "月";
      return month + 1 + txt;
    },
    // 获取周末class
    getWeekdayClass(date) {
      let today = new Date();
      return {
        weekday: date.weekday === 6 || date.weekday === 0,
        today:
          date.year === today.getFullYear() &&
          date.month === today.getMonth() &&
          date.day === today.getDate(),
        select: date.select,
      };
    },
    // 获取中文星期N
    getWeekdayTxt(weekday) {
      let txt = "星期";
      let arr = ["日", "一", "二", "三", "四", "五", "六"];
      return txt + arr[weekday];
    },
    // 当前鼠标选中的class
    getHoverDay(showHoverDay, item) {
      if (item === this.showHoverItem) {
        return "hover-" + showHoverDay;
      }
      return "";
    },
    // 鼠标悬浮 进入 类型
    enterType(process) {
      setTimeout(() => {
        this.showHover = process.id;
      }, 0);
    },
    // 鼠标悬浮 离开 类型
    leaveType() {
      this.showHover = "";
    },
    // 鼠标悬浮 进入 天
    enterDay(el, work) {
      this.isHoverDay = true;
      this.showHoverDay = el.type;
      this.showHoverItem = work;
    },
    // 鼠标悬浮 离开 天
    leaveDay() {
      this.isHoverDay = false;
      setTimeout(() => {
        if (!this.isHoverDay) {
          this.showHoverDay = "";
          this.showHoverItem = null;
        }
      }, 0);
    },
    // 新增工作项目
    addWork(work) {
      if (work) {
        this.work = work;
        this.modalTitle = "新增计划";
        this.modal = AddItemVue;
      } else {
        this.modalTitle = "新增项目";
        this.modal = AddWorkVue;
      }
      this.visible = true;
    },
    // 新增计划类型
    addProcess() {
      this.modalTitle = "新增计划";
      this.modal = AddProcessVue;
      this.visible = true;
    },
    // 工作项目详情 or 工作计划详情
    editWork(work, type = 1, item) {
      if (type === 1) {
        this.modalTitle = "计划详情";
        this.modal = EditItemVue;
      } else {
        this.modalTitle = "项目详情";
        this.modal = EditWorkVue;
      }
      this.work = work;
      this.item = item;
      this.visible = true;
    },
    // 事件详情
    eventDetail(work, date, event) {
      this.eventDetails = event;
      this.work = work;
      this.eventDate = date;
      this.modalTitle = "事件详情";
      this.modal = EditEventVue;
      this.visible = true;
    },
    // 新增事件
    eventAdd(work, date) {
      this.work = work;
      this.eventDate = date;
      this.modalTitle = "新增事件";
      this.modal = AddEventVue;
      this.visible = true;
    },
    // 初始化监听window resize
    initRect() {
      this.addEvent();
      window.addEventListener("resize", this.addEvent, false);
    },
    // window resize callback
    addEvent() {
      this.calendarBoxWidth = this.$refs.calendarBox.getBoundingClientRect().width;
    },
    // 移除监听window resize
    removeEvent() {
      window.removeEventListener("resize", this.addEvent, false);
    },
    // 滚动条定位
    scrollLeft() {
      let time = new Date();
      let temp = 24 * 3600 * 1000;
      let day = Math.round((time.getTime() - this.stime.getTime()) / temp);
      this.scrollData.left = 70 * (day - 2);
      this.$refs.box.scrollLeft = this.scrollData.left;
      this.showScrollBtn = false;
    },
    // 缩略图 点选
    scrollLeftTo(event) {
      let _left = this.scrollData.left * this.scale;
      let width = (this.calendarBoxWidth - 160) * this.scale;
      let x = _left + width / 2;
      let offsetX = event.offsetX;
      let dx = (offsetX - x) / this.scale;
      let left = this.scrollData.left + dx;
      if (left < 0) {
        left = 0;
      } else if (left * this.scale > this.calendarBoxWidth - width) {
        left = (this.calendarBoxWidth - width) / this.scale;
      }
      this.scrollData.left = left;
      this.$refs.box.scrollLeft = left;
      this.showScrollBtn = true;
    },
    // 缩略图 按下
    scrollDown(event) {
      this.scrollData.show = true;
      this.scrollData.sx = this.scrollData.left;
      this.scrollData.ex = event.pageX;
    },
    // 缩略图 移动
    scrollMove(event) {
      let dx = (event.pageX - this.scrollData.ex) / this.scale;
      let left = this.scrollData.sx + dx;
      let width = (this.calendarBoxWidth - 160) * this.scale;
      if (left < 0) {
        left = 0;
      } else if (left * this.scale > this.calendarBoxWidth - width) {
        left = (this.calendarBoxWidth - width) / this.scale;
      }
      this.scrollData.left = left;
      this.$refs.box.scrollLeft = left;
      this.showScrollBtn = true;
    },
    // 缩略图 松开
    scrollUp(event) {
      this.scrollData.show = false;
    },
    // 初始化缩略图
    initCanvas() {
      let width = this.canvasStyle.width;
      let height = this.canvasStyle.height;
      if (this.$refs.canvasBox.children.length) {
        this.$refs.canvasBox.removeChild(this.$refs.canvasBox.children[0]);
      }
      html2canvas(this.$refs.canvasSource).then((canvas) => {
        canvas.style.width = width;
        canvas.style.height = height;
        this.$refs.canvasBox.appendChild(canvas);
      });
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false;
      this.modal = null;
    },
  },
  beforeDestroy() {
    this.removeEvent();
  },
};
</script>

<style lang="scss" scoped>
.richeng-box {
  text-align: center;
  padding: 10px 0 0;
  align-items: flex-start;
  .richeng-tbody {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    width: 160px;
  }
  .richeng-tbody-2 {
    width: calc(100% - 160px);
    .richeng-flex-2 {
      overflow: hidden;
      // overflow-y: hidden;
      // overflow-x: auto;
      width: 100%;
      .check-box {
        height: 54px;
        pointer-events: none;
        &.active {
          background: rgba($color: #000000, $alpha: 0.05);
        }
        .check-box-left,
        .check-box-right {
          pointer-events: auto;
          width: 2px;
          height: 54px;
          background: rgba($color: #000000, $alpha: 0.2);
          top: 0;
          cursor: w-resize;
          &:after {
            content: "";
            width: 12px;
            height: 54px;
            position: absolute;
            left: -4px;
            top: 0;
          }
        }
        .check-box-left {
          left: 0;
        }
        .check-box-right {
          right: 0;
        }
      }
    }
    .scroll-btn {
      position: absolute;
      right: 5px;
      bottom: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .flex-td,
    .flex-th {
      border-left: 0px none;
    }
    .flex-item-type {
      text-align: center;
      height: 54px;
      flex: 1;
      border-right: 1px solid #ddd;
      opacity: 0.8;
      transition-duration: 300ms;
      &:hover {
        opacity: 1;
      }
      &:last-child {
        border-right-color: transparent;
      }
    }
    .flex-item-type-box {
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      flex-direction: column;
      .flex-item-type-item {
        width: 100%;
        flex: 1;
      }
    }
    .flex-item-4 {
      width: 100%;
      -webkit-user-select: none;
      user-select: none;
      .flex-item-days {
        border-right: 1px solid #f1f2f3;
        &:last-child {
          border-right-color: transparent;
        }
        width: 70px;
        height: 54px;
        .event-item,
        .event-add {
          cursor: pointer;
        }
        .event-add {
          background: url("~@/assets/img/add.png") no-repeat center center;
          height: 16px;
          width: 16px;
          opacity: 0;
        }
        &:hover {
          .event-add {
            opacity: 0.6;
          }
        }
        .event-box {
          top: 0;
          // height: 20px;
          line-height: 16px;
          left: 0;
          right: 0;
          padding: 5px 5px 0;
          pointer-events: none;
          flex-wrap: wrap;
          > div {
            pointer-events: auto;
          }
        }
      }
      .flex-item-days-box {
        z-index: 1;
        pointer-events: none;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
      }
      .flex-item-month {
        right: 5px;
        top: 5px;
        font-size: 14px;
        line-height: 1;
        font-family: "FuturaStd-Medium";
      }
      .flex-item-day {
        font-size: 18px;
        font-family: "FuturaStd-Heavy";
        line-height: 1;
        margin-top: 17px;
        display: block;
        pointer-events: none;
      }
      .weekday {
        color: #b04343;
      }
      .today {
        background: url("~@/assets/img/t01466605632c4751dc.png") no-repeat
          center center;
      }
      .flex-item-weekday {
        font-size: 14px;
        width: 100%;
        left: 0;
        bottom: 5px;
        line-height: 1;
      }
      .richeng-items-list {
        height: 54px;
        width: 100%;
        left: 0;
        top: 0;
        z-index: -1;
        .richeng-items-item {
          height: 54px;
          color: #fff;
          line-height: 54px;
          opacity: 0.5;
          transition-duration: 300ms;
          &.richeng-items-item-check,
          &.richeng-items-item-hover {
            opacity: 1;
          }
        }
      }
    }
  }
  .flex-td,
  .flex-th {
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    height: 54px;
    line-height: 54px;
  }
  .flex-item-1 {
    width: 160px;
  }
  .flex-item-2 {
    width: 80px;
  }
  .flex-item-3 {
    width: 100px;
  }
  .flex-item-delete,
  .flex-item-add {
    color: dodgerblue;
    right: 0;
    height: 20px;
    width: 20px;
    line-height: 20px;
    top: 0;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
  }
  .flex-item-edit {
    width: 100%;
    height: 100%;
    cursor: pointer;
    left: 0;
    top: 0;
    &:hover {
      background: rgba($color: #000000, $alpha: 0.05);
    }
  }
  .flex-item-delete {
    right: 20px;
    color: rgb(163, 163, 163);
  }
}
.process-5 .bg-color {
  background-color: #09c3d0;
}
.process-6 .bg-color {
  background-color: #0987f7;
}
.process-7 .bg-color {
  background-color: #8ec720;
}
.process-8 .bg-color {
  background-color: #dcba12;
}
.process-9 .bg-color {
  background-color: #f56d6d;
}
.bg-color {
  opacity: 0.6;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  &.hover,
  &:hover {
    opacity: 1;
  }
}
.hover-5 .process-5,
.hover-6 .process-6,
.hover-7 .process-7,
.hover-8 .process-8,
.hover-9 .process-9 {
  .bg-color {
    opacity: 1;
  }
}
.process-list {
  width: 400px;
  height: 32px;
  align-items: flex-end;
  .bg-color:hover {
    opacity: 0.6;
  }
}
.richeng-box:hover {
  .richeng-canvas {
    display: block;
  }
}
.richeng-canvas {
  left: 0px;
  border: 1px solid #ddd;
  top: 100%;
  overflow: hidden;
  display: none;
  z-index: 2;
  // pointer-events: none;
  .richeng-canvas-bar {
    top: 0;
    left: 500px;
    background: #000;
    opacity: 0.3;
    width: 500px;
    height: 100%;
  }
}
.scroll-mask {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  right: 0;
  bottom: 0;
  // background: rgba($color: #000000, $alpha: 0.2);
}
</style>
