/* eslint-disable no-unused-vars */
import { red } from "@material-ui/core/colors";
import { useMemo } from "react";
import { useState } from "react";
import { useRef, useEffect } from "react"
import './ImageEdit.css'
import { useRect } from './useRect'
import { useResizeRect, ResizeTypes } from "./useResizeRect";



export const ImageEdit = () => {
    const canvas = useRef();
    const [width, setWidth] = useState(640);
    const [height, setHeight] = useState(480);
    //const [selectTrack, setSelectTrack] = useState({ left: 10, top: 10, right: 50, bottom: 50, isshow: false });
    const canvas_rect = useRef({ left: 0, top: 0, right: 0, bottom: 0 });
    const [selectRect, setSelectBegin, setSelectMove, setSelectEnd] = useRect(canvas_rect.current);
    const [editRect, setEditRect] = useState({ x: 30, y: 60, width: 100, height: 200, isshow: false });
    const [editresize, setEditResizeBegin, setEditResizeMove, setEditResizeEnd] = useResizeRect();
    //const[imgresize, setImgResizeBegin,setImgResizeMove,setImgResizeEnd]=useResizeRect();
    useEffect(() => {
        fillRect(100, 100, 100, 100);
    }, [width, height]);

    const fillRect = (x, y, width, height) => {
        //setResizeMove(0,0, directions.EAST);
        const ctx = canvas.current.getContext("2d");
        //console.log(`width:${video.width}  height:${video.height}`);
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        ctx.save();   //儲存狀態
        ctx.fillStyle = '#ffff00';
        //ctx.fillRect(x, y, width, height);
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

        ctx.restore(); //到此才輸出，才不會還沒整體操作完就放出，會造成畫面快速抖動
    };


    const canvas_Mousedown = (data) => {
        console.log(`canvas_Mousedown ${data}`);
        if(editRect.isshow===true){
            setEditRect(obj=>{
                return{
                    ...obj,
                    isshow:false
                }
            });
        }

        canvas_rect.current.left = parseInt(canvas.current.style.left);
        canvas_rect.current.top = parseInt(canvas.current.style.top);
        canvas_rect.current.right = canvas_rect.current.left + canvas.current.width;
        canvas_rect.current.bottom = canvas_rect.current.top + canvas.current.height;
        console.log(canvas_rect.current);
        let select_track = document.getElementById("select_track");
        let paint = document.getElementById("paint");
        let rect = paint.getBoundingClientRect();
        let x = data.clientX - rect.x - 5;
        let y = data.clientY - rect.y - 5;
        //setSelectTrack({ left: x, top: y, right: x, bottom: y, isshow: true, limitrect:{left: canvas_rect.current.left, top: canvas_rect.current.top, right: canvas_rect.current.right, bottom: canvas_rect.current.bottom} });
        setSelectBegin(x, y);
    }

    let resizemode = "";
    const mousedown = (e, resize) => {
        console.log(`mousedown ${e}`);
        resizemode = resize;
        console.log(`resize ${resizemode}`);
        let tracker = document.getElementById("resize_track");
        tracker.style.width = `${canvas.current.width}px`;
        tracker.style.height = `${canvas.current.height}px`;
        tracker.style.display = "block";
    }

    const mousemove = (data) => {
        console.log(`mousemove ${data}`);
        if (selectRect.show === true) {
            let paint = document.getElementById("paint");
            let rect = paint.getBoundingClientRect();
            let x = data.clientX - rect.x - 5;
            let y = data.clientY - rect.y - 5;

            if (x <= canvas_rect.current.left) {
                x = canvas_rect.current.left;
            }
            else if (x >= canvas_rect.current.right) {
                x = canvas_rect.current.right;
            }
            if (y <= canvas_rect.current.top) {
                y = canvas_rect.current.top;
            }
            else if (y >= canvas_rect.current.bottom) {
                y = canvas_rect.current.bottom;
            }
            setSelectMove(x, y);
        }
        else if (editReizeAction.current !== "") {
            let paint = document.getElementById("paint");
            let rect = paint.getBoundingClientRect();
            let x = data.clientX - rect.x + 5;
            let y = data.clientY - rect.y + 5;
            switch (editReizeAction.current) {
                case "drag":
                    x = x - editMovePos.current.x;
                    y = y - editMovePos.current.y;

                    let tracker = document.getElementById("edit_track");
                    setEditRect(obj => {
                        return {
                            ...obj,
                            x: x,
                            y: y
                        }
                    });
                    break;
                case "left_top":
                case "top":
                case "top_right":
                case "right":
                case "right_bottom":
                case "bottom":
                case "left_bottom":
                case "left":
                    setEditResizeMove(x, y);
                    break;
                default: break;
            }
        }

        if (resizemode !== "") {
            let tracker = document.getElementById("resize_track");
            let rect = data.target.getBoundingClientRect();
            let x = data.clientX - rect.x;
            let y = data.clientY - rect.y;
            switch (resizemode) {
                case "resize_w":
                    tracker.style.width = `${x}px`;
                    break;
                case "resize_h":
                    tracker.style.height = `${y}px`;
                    break;
                case "resize_wh":
                    tracker.style.width = `${x}px`;
                    tracker.style.height = `${y}px`;
                    break;
                default: break;

            }
        }
    }

    const mouseup = (data) => {
        if (selectRect.show === true) {
            setSelectEnd();
            setEditRect({x:selectRect.x, y:selectRect.y,width:selectRect.width, height:selectRect.height,isshow:true});
        }
        else if (editresize.show === true) {
            setEditResizeEnd();
            setEditRect(obj=>{
                return{
                    ...obj,
                    x:editresize.x,
                    y:editresize.y,
                    width:editresize.width, 
                    height:editresize.height
                }
            });
        }
        else if (editReizeAction.current !== "") {
            console.log("editReizeAction.current !== ");
            editReizeAction.current = "";
        }
        else if (resizemode !== "") {
            let tracker = document.getElementById("resize_track");
            tracker.style.display = "none";
            let rect = data.target.getBoundingClientRect();
            let x = data.clientX - rect.x;
            let y = data.clientY - rect.y;
            switch (resizemode) {
                case "resize_w":
                    setWidth(x);
                    break;
                case "resize_h":
                    setHeight(y);
                    break;
                case "resize_wh":
                    setWidth(x);
                    setHeight(y);
                    break;
                default: break;

            }
            resizemode = "";
        }
    }

    const editMovePos = useRef({ x: 0, y: 0 });
    const editReizeAction = useRef("");
    const editTrackdown = (e, action) => {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.x + 5;
        let y = e.clientY - rect.y + 5;
        
        editReizeAction.current = action;
        switch (action) {
            case "drag":
                editMovePos.current.x = x;
                editMovePos.current.y = y;
                break;
            case "left_top":
            case "top":
            case "top_right":
            case "right":
            case "right_bottom":
            case "bottom":
            case "left_bottom":
            case "left":
                setEditResizeBegin(action, editRect.x, editRect.y, editRect.width, editRect.height);
                break;
            default: break;
        }
    }


    return (
        <div className="box">
            <div className="row header">
                Riibon
            </div>
            <div className="row content" onMouseMove={(e) => mousemove(e)} onMouseUp={(e) => mouseup(e)} id="paint">
                <div style={{ position: "relative", background: "wheat", width: `${width + 10}px`, height: `${height + 10}px`, marginTop: "5px", marginLeft: "5px" }}>
                    <div style={{ clipPath: "inset(0px 0px 0px 0px)", position: "absolute", width: `${width + 10}px`, height: `${height + 10}px` }}>
                        <div onMouseDown={(e) => mousedown(e, "resize_wh")} style={{ position: "absolute", width: "10px", height: "10px", background: "white", border: "1px solid black", left: `${width}px`, top: `${height}px`, cursor: "nw-resize" }} id="resize_wh"></div>
                        <div onMouseDown={(e) => mousedown(e, "resize_h")} style={{ position: "absolute", width: "10px", height: "10px", background: "white", border: "1px solid black", left: `${width / 2 - 10}px`, top: `${height}px`, cursor: "n-resize" }} id="resize_h"></div>
                        <div onMouseDown={(e) => mousedown(e, "resize_w")} style={{ position: "absolute", width: "10px", height: "10px", background: "white", border: "1px solid black", left: `${width}px`, top: `${height / 2 - 10}px`, cursor: "e-resize" }} id="resize_w"></div>
                        <canvas onMouseDown={(e) => canvas_Mousedown(e)} ref={canvas} style={{ position: "absolute", left: "0px", top: "0px" }} width={`${width}px`} height={`${height}px`}></canvas>
                    </div>
                    <div style={{ left: `${selectRect.x}px`, top: `${selectRect.y}px`, width: `${selectRect.width}px`, height: `${selectRect.height}px`, display: `${selectRect.show ? "block" : "none"}`, position: "absolute", border: "1px solid black", borderStyle: "dashed" }}></div>
                    {/* <div id="edit_track" style={{ border: "1px solid #0078D7", borderStyle: "dashed",position: "absolute", left: `${editRect.x}px`, top: `${editRect.y}px`, height: `${editRect.height}px`, width: `${editRect.width}px`, display: `${editRect.isshow?"grid":"none"}`, gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr" }}>
                        <div onMouseDown={(e) => editTrackdown(e, "drag")} style={{ gridColumn: "1 / 4", gridRow: "1 / 4", cursor: "move" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.left_top)} style={{ gridColumn: "1", gridRow: "1", alignSelf: "start", justifySelf: "start", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "nw-resize", marginLeft:"-5px", marginTop:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.top)} style={{ gridColumn: "2", gridRow: "1", alignSelf: "start", justifySelf: "center", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "n-resize", marginTop:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.top_right)} style={{ gridColumn: "3", gridRow: "1", alignSelf: "start", justifySelf: "end", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "sw-resize", marginTop:"-5px", marginRight:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.left)} style={{ gridColumn: "1", gridRow: "2", alignSelf: "center", justifySelf: "start", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "w-resize", marginLeft:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.right)} style={{ gridColumn: "3", gridRow: "2", alignSelf: "center", justifySelf: "end", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "w-resize", marginRight:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.left_bottom)} style={{ gridColumn: "1", gridRow: "3", alignSelf: "end", justifySelf: "start", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "sw-resize", marginLeft:"-5px", marginBottom:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.bottom)} style={{ gridColumn: "2", gridRow: "3", alignSelf: "end", justifySelf: "center", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "n-resize", marginBottom:"-5px" }}></div>
                        <div onMouseDown={(e) => editTrackdown(e, ResizeTypes.right_bottom)} style={{ gridColumn: "3", gridRow: "3", alignSelf: "end", justifySelf: "end", border: "1px solid black", background: "white", width: "10px", height: "10px", cursor: "nw-resize", marginRight:"-5px", marginBottom:"-5px" }}></div>
                    </div> */}
                    <div style={{ left: `${editresize.x}px`, top: `${editresize.y}px`, width: `${editresize.width}px`, height: `${editresize.height}px`, display: `${editresize.show ? "block" : "none"}`,cursor:`${editresize.cursor}`, position: "absolute", border: "1px solid black", borderStyle: "dashed" }}></div>
                    <div id="resize_track" style={{ position: "absolute", width: "498px", height: "298px", border: "1px solid black", borderStyle: "dashed", display: "none" }}></div>
                </div>
            </div>
            <div className="row footer">
                status bar
            </div>
        </div>
    )

}