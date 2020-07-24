<template>
  <div class="home">
    <div class="richeng-box flex">
      <div class="richeng-tbody">
        <div class="flex richeng-flex">
          <div class="flex-th flex-item-1">名称</div>
          <div class="flex-th flex-item-2">创建人</div>
          <div class="flex-th flex-item-3">状态</div>
        </div>
        <div class="flex richeng-flex" v-for="(item, key) in list" :key="key">
          <div class="flex-td flex-item-1 text-overflow">{{ item.name }}</div>
          <div class="flex-td flex-item-2 text-overflow">{{ item.owner }}</div>
          <div class="flex-td flex-item-3 text-overflow">{{ getStatus(item.status) }}</div>
        </div>
      </div>
      <div class="richeng-tbody richeng-tbody-2">
        <div class="flex richeng-flex">
          <div class="flex-th flex-item-4">
            <div class="flex richeng-days">
              <div
                class="flex-item-type pos-rel"
                :class="item.type"
                v-for="(item, key) in listHead"
                :key="key"
                @click="checkType(item)"
                @mouseenter="enterType(item)"
                @mouseleave="leaveType(item)"
              >
                <div class="pos-abs bg-color"></div>
                <span class="flex-item-day">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="richeng-flex-2">
          <div class="pos-rel" :style="itemStyle">
            <div class="flex" v-for="(item, key) in list" :key="key">
              <div class="flex-td flex-item-4 pos-rel">
                <div class="flex richeng-days">
                  <div
                    class="flex-item-days pos-rel"
                    :class="getWeekdayClass(date)"
                    v-for="(date, keys) in item.days"
                    :key="keys"
                    @click="checkDay(item, date, keys, key)"
                    @mouseenter="enterDay(item, date, keys, key)"
                    @mouseleave="leaveDay(item, date, keys, key)"
                    @dblclick="editDay(item, date, keys, key)"
                  >
                    <div class="pos-abs flex-item-days-box">
                      <span class="pos-abs flex-item-month">{{ getMonthTxt(date.month) }}</span>
                      <span class="flex-item-day">{{ date.day }}</span>
                      <span class="pos-abs flex-item-weekday">{{ getWeekdayTxt(date.weekday) }}</span>
                    </div>
                    <div class="pos-abs flex-item-type-box flex">
                      <div
                        v-for="(el, keys2) in date.type"
                        :key="keys2"
                        :class="el.type"
                        class="flex-item-type-item pos-rel"
                      >
                        <div class="pos-abs bg-color"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pos-abs check-box" :class="{active: drawBox.show}" :style="checkBoxStyle">
              <div class="check-box-left pos-abs" @mousedown="drawDown($event, 'left')"></div>
              <div class="check-box-right pos-abs" @mousedown="drawDown($event, 'right')"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="draw-mask"
      @mousemove="drawMove($event)"
      @mouseup="drawUp($event)"
      v-show="drawBox.show"
    ></div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      list: [],
      days: [],
      listHead: [],
      stime: null,
      selectBox: {
        start: null,
        end: null,
        state: false,
        item: null,
      },
      drawBox: {
        show: false,
        x: 0,
        type: "",
        left: 0,
        width: 0,
      },
      checkBox: {
        left: 0,
        width: 0,
        top: 0,
        show: false,
        item: null,
        index: 0,
      },
    };
  },
  created() {
    window.vl = this;
    this.initList();
  },
  computed: {
    itemStyle() {
      return {
        width: this.days.length * 80 + "px",
      };
    },
    checkBoxStyle() {
      return {
        left: this.checkBox.left + "px",
        width: this.checkBox.width + "px",
        top: this.checkBox.top + "px",
        display: this.checkBox.show ? "block" : "none",
      };
    },
  },
  methods: {
    initList() {
      this.listHead = [
        {
          type: "prd",
          name: "PRD",
        },
        {
          type: "meeting",
          name: "会议",
        },
        {
          type: "ui",
          name: "UI",
        },
        {
          type: "dev",
          name: "开发",
        },
        {
          type: "test",
          name: "测试",
        },
        {
          type: "product",
          name: "交付",
        },
      ];
      let list = [
        {
          name: "巴南项目",
          // id: 1,
          time: "2020-06-21 00:00:00",
          createtime: "2020-06-21 00:00:00",
          owner: "何志",
          status: 1,
          items: [
            {
              name: "PRD阶段",
              type: "prd",
              day: 2,
              owner: "何志",
              time: "2020-06-21 00:00:00",
              edit: [],
            },
            {
              name: "会议协同",
              type: "meeting",
              day: 1,
              owner: "何志",
              time: "2020-06-22 00:00:00",
              edit: [],
            },
            {
              name: "UI阶段",
              type: "ui",
              day: 2,
              owner: "王婉儿",
              time: "2020-06-23 00:00:00",
              edit: [],
            },
            {
              name: "开发阶段",
              type: "dev",
              day: 2,
              owner: "潘涛",
              time: "2020-06-25 00:00:00",
              edit: [],
            },
            {
              name: "测试阶段",
              type: "test",
              day: 2,
              owner: "文静",
              time: "2020-06-27 00:00:00",
              edit: [],
            },
            {
              name: "试运行阶段",
              type: "product",
              day: 1,
              owner: "何志",
              time: "2020-06-28 00:00:00",
              edit: [],
            },
          ],
        },
        {
          name: "经开项目",
          time: "2020-06-22 00:00:00",
          createtime: "2020-06-22 00:00:00",
          owner: "余林徽",
          status: 1,
          items: [
            {
              name: "PRD阶段",
              type: "prd",
              day: 2,
              owner: "何志",
              time: "2020-06-22 00:00:00",
              edit: [],
            },
            {
              name: "会议协同",
              type: "meeting",
              day: 1,
              owner: "何志",
              time: "2020-06-23 00:00:00",
              edit: [],
            },
            {
              name: "UI阶段",
              type: "ui",
              day: 2,
              owner: "王婉儿",
              time: "2020-06-24 00:00:00",
              edit: [],
            },
            {
              name: "开发阶段",
              type: "dev",
              day: 2,
              owner: "潘涛",
              time: "2020-06-26 00:00:00",
              edit: [],
            },
            {
              name: "测试阶段",
              type: "test",
              day: 2,
              owner: "文静",
              time: "2020-06-28 00:00:00",
              edit: [],
            },
            {
              name: "试运行阶段",
              type: "product",
              day: 1,
              owner: "何志",
              time: "2020-06-29 00:00:00",
              edit: [],
            },
          ],
        },
      ];
      list.forEach((ele) => {
        ele.days = []
      });
      this.list = list;
      this.createTime();
    },
    resetList(dx, type) {
      if (!dx) {
        return false;
      }
      let item = this.checkBox.item;
      let index = this.checkBox.index;
      let items = item.items[index];
      let day = Math.abs(dx / 80);
      if (dx < 0 && index === 0) {
        return false;
      }
      if (type === "left") {
        if (dx < 0) {
          // 左移
          // items.day += day;
          // item.day += day;
          // let time = new Date(item.time).getTime()
          // item.time = this.formatDate(new Date(time + day * 24 * 3600 * 1000))
        } else {
          // 右移
        }
      } else {
        if (dx < 0) {
          // 左移
        } else {
          // 右移
        }
      }
      this.createTime();
    },
    createTime() {
      let ntime = new Date();
      let stime = ntime;
      let etime = ntime;
      this.list.forEach((ele) => {
        let time_start = new Date(ele.time);
        if (stime.getTime() > time_start.getTime()) {
          stime = time_start;
        }
        let time_end = new Date(
          time_start.getTime() + (ele.day - 1) * 24 * 3600 * 1000
        );
        if (etime.getTime() < time_end.getTime()) {
          etime = time_end;
        }
      });
      let days = [];
      // 前后各加十天
      // stime = new Date(stime.getTime() - 10 * 24 * 3600 * 1000);
      etime = new Date(etime.getTime() + 10 * 24 * 3600 * 1000);
      this.stime = stime;
      let t1 = stime.getTime();
      let t0 = ntime.getTime();
      let t2 = etime.getTime();
      let temp = 24 * 3600 * 1000;
      let dayIndex = 0;
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
        };
        days.push(item);
        dayIndex++;
      }
      this.list.forEach((ele) => {
        ele.days = JSON.parse(JSON.stringify(days))
        ele.items.forEach((el) => {
          let len = el.day;
          for (let i = 0; i < len; i++) {
            let date = new Date(
              new Date(el.time).getTime() + i * 24 * 3600 * 1000
            );
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDate();
            let item = ele.days.find(el => {
              return el.year === year && el.month === month && el.day === day
            })
            item.type.push({
              type: el.type,
              index: i,
              len: len,
            });
          }
        });
      });
      this.days = days;
    },
    formatDate(date) {
      let str =
        date.getFullYear() +
        "-" +
        this.foamatNum(date.getMonth() + 1) +
        "-" +
        this.foamatNum(date.getDate()) +
        " " +
        this.foamatNum(date.getHours()) +
        ":" +
        this.foamatNum(date.getMinutes()) +
        ":" +
        this.foamatNum(date.getSeconds());
      return str;
    },
    foamatNum(number, len = 2) {
      number = "0000000000" + number;
      return number.substr(number.length - 2, 2);
    },
    getStatus(status) {
      let txt = "";
      switch (Number(status)) {
        case 0:
          txt = "已过期";
          break;
        case 1:
          txt = "进行中";
          break;
        case 2:
          txt = "未开始";
          break;
        case 3:
          txt = "延期进行";
          break;
        case 4:
          txt = "延期完成";
          break;
        case 5:
          txt = "提前完成";
          break;
        default:
          txt = "未定义";
      }
      return txt;
    },
    getMonthTxt(month) {
      let txt = "月";
      return month + 1 + txt;
    },
    getWeekdayClass(date) {
      return {
        weekday: date.weekday === 6 || date.weekday === 0,
        select: date.select,
      };
    },
    getWeekdayTxt(weekday) {
      let txt = "星期";
      let arr = ["日", "一", "二", "三", "四", "五", "六"];
      return txt + arr[weekday];
    },
    //获得左侧时间间隔
    getLeftDay(times) {
      let time = new Date(times.time);
      let stime = this.stime;
      let temp = time.getTime() - stime.getTime();
      let day = Math.ceil(temp / 24 / 3600 / 1000);
      return day;
    },
    getItems(item, date, keys) {
      let time = new Date(item.time);
      let stime = this.stime;
      let temp = time.getTime() - stime.getTime();
      let day = Math.ceil(temp / 24 / 3600 / 1000);
      let items = null;
      if (day <= keys) {
        for (let i = 0; i < item.items.length; i++) {
          let ele = item.items[i];
          day += ele.day;
          if (day > keys) {
            items = ele;
            break;
          }
        }
      }
      return items;
    },
    editDay(item, date, keys, key) {
      let items = this.getItems(item, date, keys);
      if (items) {
        items.check = false;
        console.log("edit : ", items);
      }
    },
    checkDay(item, date, keys, key) {
      if (this.selectBox.state) {
        this.selectBox.state = false;
        this.selectBox.end = date;
        date.select = true;
        if (this.selectBox.item !== item) {
          console.log("不在同一个行");
        }
      } else {
        this.selectBox.state = true;
        this.selectBox.start = date;
        this.selectBox.item = item;
        date.select = true;
      }
      return false;
      this.list.forEach((ele) => {
        ele.items.forEach((el) => {
          el.check = false;
        });
      });
      let items = this.getItems(item, date, keys);
      if (items) {
        items.check = true;
        let index = this.list[key].items.findIndex((el) => el === items);
        //获得左侧时间间隔
        let time = new Date(item.time);
        let stime = this.stime;
        let temp = time.getTime() - stime.getTime();
        let day = Math.ceil(temp / 24 / 3600 / 1000);
        for (let i = 0; i < index; i++) {
          day += this.list[key].items[i].day;
        }
        this.checkBox.item = item;
        this.checkBox.index = index;
        this.checkBox.left = day * 80;
        this.checkBox.width = items.day * 80;
        this.checkBox.top = 54 * key;
        this.checkBox.show = true;
      }
    },
    enterDay(item, date, keys, key) {
      let items = this.getItems(item, date, keys);
      if (items) {
        items.hover = true;
      }
    },
    leaveDay(item, date, keys, key) {
      let items = this.getItems(item, date, keys);
      if (items) {
        items.hover = false;
      }
    },
    checkType(item) {},
    enterType(item) {},
    leaveType(item) {},
    drawDown(event, type) {
      this.drawBox.type = type;
      this.drawBox.show = true;
      this.drawBox.x = event.pageX;
      this.drawBox.y = event.pageY;
      this.drawBox.left = this.checkBox.left;
      this.drawBox.width = this.checkBox.width;
    },
    drawMove(event) {
      let x = event.pageX;
      let dx = x - this.drawBox.x;
      if (this.drawBox.type === "left") {
        this.checkBox.left = this.drawBox.left + dx;
        this.checkBox.width = this.drawBox.width - dx;
      } else {
        this.checkBox.width = this.drawBox.width + dx;
      }
    },
    drawUp(event) {
      let x = event.pageX;
      let dx = x - this.drawBox.x;
      dx = Math.round(dx / 80) * 80;
      if (this.drawBox.type === "left") {
        this.checkBox.left = this.drawBox.left + dx;
        this.checkBox.width = this.drawBox.width - dx;
      } else {
        this.checkBox.width = this.drawBox.width + dx;
      }
      this.resetList(dx, this.drawBox.type);
      this.drawBox.show = false;
      this.drawBox.type = "";
      this.drawBox.x = 0;
      this.drawBox.y = 0;
      this.drawBox.left = 0;
      this.drawBox.width = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.richeng-box {
  text-align: center;
  padding: 10px;
  align-items: flex-start;
  .richeng-tbody {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    width: 340px;
  }
  .richeng-tbody-2 {
    width: calc(100% - 340px);
    .richeng-flex-2 {
      overflow-y: hidden;
      overflow-x: auto;
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
    .flex-td,
    .flex-th {
      border-left: 0px none;
    }
    .flex-item-type {
      text-align: center;
      height: 54px;
      flex: 1;
      border-left: 1px solid #ddd;
      opacity: 0.8;
      transition-duration: 300ms;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
      &:first-child {
        border-left: 0px none;
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
    .prd .bg-color{
      background-color: #09c3d0;
    }
    .meeting .bg-color{
      background-color: #0987f7;
    }
    .ui .bg-color{
      background-color: #8ec720;
    }
    .dev .bg-color{
      background-color: #dcba12;
    }
    .test .bg-color{
      background-color: #f56d6d;
    }
    .product .bg-color{
      background-color: #1fa740;
    }
    .bg-color {
      opacity: 0.6;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      &:hover{
        opacity: 1;
      }
    }
    .flex-item-4 {
      width: 100%;
      -webkit-user-select: none;
      user-select: none;
      .flex-item-days {
        border-left: 1px solid #f1f2f3;
        &:first-child {
          border-left: 0px none;
        }
        width: 80px;
        height: 54px;
        &.select {
          .flex-item-type-box {
            background: rgba($color: #000000, $alpha: 0.2);
          }
          .bg-color {
            background: rgba($color: #000000, $alpha: 0);
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
        opacity: 0.6;
        font-family: "FuturaStd-Medium";
      }
      .flex-item-day {
        font-size: 16px;
        opacity: 0.8;
        font-family: "FuturaStd-Heavy";
        line-height: 1;
        margin-top: 15px;
        display: block;
        pointer-events: none;
      }
      .weekday {
        color: #b04343;
        span {
          opacity: 0.2;
        }
      }
      .flex-item-weekday {
        opacity: 0.6;
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
    // .richeng-days {
    //   pointer-events: none;
    // }
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
    width: 100px;
  }
  .flex-item-3 {
    width: 80px;
  }
}
.draw-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  cursor: w-resize;
}
</style>
