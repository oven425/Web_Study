/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";


// export const ResizeTypes = {
//   none: "none",
//   left_top: "left_top",
//   top: "top",
//   top_right: "top_right",
//   right: "right",
//   right_bottom: "right_bottom",
//   bottom: "bottom",
//   left_bottom: "left_bottom",
//   left: "left",
// };

// export const useResizeRect = () => {
//   const resizeType = useRef(ResizeTypes.none);
//   const limit = useRef({ left: 0, top: 0, right: 0, bottom: 0 });
//   const [rect, setRect] = useState({
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//     show: false,
//     cursor: "default",
//   });

//   const lastCursor = useRef("default");
//   const resizeBegin = (type, x, y, width, height) => {
//     resizeType.current = type;
//     //lastCursor.current = cursor;
//     console.log(resizeType.current);
//     let cur_cusrsour = "nw-resize";
//     switch (resizeType.current) {
//       case ResizeTypes.left_top:
//       case ResizeTypes.right_bottom:
//         cur_cusrsour = "nw-resize";
//         break;
//       case ResizeTypes.bottom:
//       case ResizeTypes.top:
//         cur_cusrsour = "n-resize";
//         break;
//       case ResizeTypes.left:
//       case ResizeTypes.right:
//         cur_cusrsour = "w-resize";
//         break;
//       case ResizeTypes.top_right:
//       case ResizeTypes.left_bottom:
//         cur_cusrsour = "sw-resize";
//         break;
//       default:
//         break;
//     }
//     limit.current.left = x;
//     limit.current.top = y;
//     limit.current.right = x + width;
//     limit.current.bottom = y + height;
//     setRect({
//       x: x,
//       y: y,
//       width: width,
//       height: height,
//       show: true,
//       cursor: cur_cusrsour,
//     });
//     console.log(`resizeBegin cursor:${cur_cusrsour}`);
//   };
//   const resizeMove = (x, y) => {
//     //console.log(resizeType.current);
//     let left = rect.x;
//     let top = rect.y;
//     let right = left + rect.width;
//     let bottom = top + rect.height;
//     let check_x = x;
//     let check_y = y;
//     switch (resizeType.current) {
//       case ResizeTypes.left_top:
//         if (x >= limit.current.right) {
//           x = limit.current.right;
//         }
//         if (y >= limit.current.bottom) {
//           y = limit.current.bottom;
//         }
//         setRect((obj) => {
//           return {
//             ...obj,
//             x: x,
//             y: y,
//             width: right - x,
//             height: bottom - y,
//           };
//         });
//         break;
//       case ResizeTypes.top:
//         if (y >= limit.current.bottom) {
//           y = limit.current.bottom;
//         }
//         setRect((obj) => {
//           return {
//             ...obj,
//             y: y,
//             height: bottom - y,
//           };
//         });
//         break;
//       case ResizeTypes.top_right:
//         if (y >= limit.current.bottom) {
//           y = limit.current.bottom;
//         }
//         setRect((obj) => {
//           return {
//             ...obj,
//             y: y,
//             width: x - left,
//             height: bottom - y,
//           };
//         });
//         break;
//       case ResizeTypes.right:
//         setRect((obj) => {
//           return {
//             ...obj,
//             width: x - left,
//           };
//         });
//         break;
//       case ResizeTypes.right_bottom:
//         setRect((obj) => {
//           return {
//             ...obj,
//             width: x - left,
//             height: y - top,
//           };
//         });
//         break;
//       case ResizeTypes.bottom:
//         setRect((obj) => {
//           return {
//             ...obj,
//             height: y - top,
//           };
//         });
//         break;
//       case ResizeTypes.left_bottom:
//         if (x >= limit.current.right) {
//           x = limit.current.right;
//         }
//         if (y <= limit.current.top) {
//           y = limit.current.top;
//         }
//         setRect((obj) => {
//           return {
//             ...obj,
//             x: x,
//             width: right - x,
//             height: y - top,
//           };
//         });
//         break;
//       case ResizeTypes.left:
//         if (x >= limit.current.right) {
//           x = limit.current.right;
//         }
//         setRect((obj) => {
//           return {
//             ...obj,
//             x: x,
//             width: right - x,
//           };
//         });
//         break;
//       default:
//         break;
//     }
//   };
//   const resizeEnd = () => {
//     resizeType.current = ResizeTypes.none;
//     setRect((obj) => {
//       return {
//         ...obj,
//         show: false,
//       };
//     });
//   };
//   return [rect, resizeBegin, resizeMove, resizeEnd];
// };

export const useEditRect = () => {
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    show: false,
  });
  const show = (x, y, width, height) => {
    setRect({ x: x, y: y, width: width, height: height, show: true });
  }
  const hide = () => {
    setRect({ x: 0, y: 0, width: 0, height: 0, show: false });
  }
  const dragBeginPos = useRef({ x: 0, y: 0 });
  const limitRect = useRef({ left: 0, top: 0, right: 0, bottom: 0 });
  const dragBegin = (x, y, limit) => {
    limitRect.current.x = limit.x;
    limitRect.current.y = limit.y;
    limitRect.current.right = limit.x + limit.width;
    limitRect.current.bottom = limit.y + limit.height;
    dragBeginPos.current.x = x - rect.x;
    dragBeginPos.current.y = y - rect.y;
    //console.log(`dragBegin x:${dragBeginPos.current.x} y:${dragBeginPos.current.y}`);
  };
  const dragMove = (x, y) => {
    //console.log(`dragMove x:${dragBeginPos.current.x} y:${dragBeginPos.current.y}`);
    let x1 = x - dragBeginPos.current.x;
    let y1 = y - dragBeginPos.current.y;
    if (x1 >= limitRect.current.right) {
      x1 = limitRect.current.right;
    }
    else if (x1 <= -rect.width) {
      x1 = -rect.width;
    }
    if (y1 >= limitRect.current.bottom) {
      y1 = limitRect.current.bottom;
    }
    else if (y1 <= -rect.height) {
      y1 = -rect.height;
    }

    //console.log(`dragMove x:${x1} y:${y1}`);
    setRect(obj => {
      return {
        ...obj,
        x: x1,
        y: y1
      }
    });
  };
  const dragEnd = () => {

  };

  return [rect, show, hide, dragBegin, dragMove, dragEnd];
};
