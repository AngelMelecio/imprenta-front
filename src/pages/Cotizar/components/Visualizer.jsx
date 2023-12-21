import React, { useEffect, useRef } from 'react'
const Visualizer = ({
  canvas,
  piece,
  pieces,
  margin,
}) => {


  const visualizerRef = useRef()
  const materialRef = useRef()

  let margin_x = (canvas?.width - pieces?.main.cols * piece.width) / 2
  let margin_y = (canvas?.height - pieces?.main.rows * piece.height) / 2

  let margin_x_p = `${(margin_x * 100 / canvas?.width).toFixed(2)}%`
  let margin_y_p = `${(margin_y * 100 / canvas?.height).toFixed(2)}%`

  let paddingT = `${(margin?.top * 100 / canvas.width).toFixed(2)}%`
  let paddingR = `${(margin?.right * 100 / canvas.width).toFixed(2)}%`
  let paddingB = `${(margin?.bottom * 100 / canvas.width).toFixed(2)}%`
  let paddingL = `${(margin?.left * 100 / canvas.width).toFixed(2)}%`


  let paddingColor =
    margin?.right > margin_x ||
      margin?.left > margin_x ||
      margin?.top > margin_y ||
      margin?.bottom > margin_y
      ? '#dc2626' : '#22c55e'


  return (
    <div
      ref={visualizerRef}
      className='w-full h-full total-center'>
      <div
        style={{
          height: Math.min(visualizerRef?.current?.clientHeight, visualizerRef?.current?.clientWidth) || 0,
          width: Math.min(visualizerRef?.current?.clientHeight, visualizerRef?.current?.clientWidth) || 0,
        }}
        className='p-4'>
        <div
          style={{ boxShadow: '3px 3px 10px 3px inset #eee', }}
          className='w-full h-full border rounded-lg p-14 bg-neutral-100 total-center'>
          <div
            ref={materialRef}
            className='relative bg-white shadow-md total-center'
            style={{
              height: `${(canvas?.height * 100 / canvas?.width).toFixed(2)}%`,
              width: '100%'
            }}>


            <div className={`h-full w-full relative`}>
              {/* Main Space Pieces */}
              {Array.from({ length: pieces?.main?.rows }).map((_, i) => (
                Array.from({ length: pieces?.main?.cols }).map((_, j) =>
                  <div
                    style={{
                      left: margin_x_p,
                      top: margin_y_p,
                      width: `${(pieces?.main.w * 100 / canvas.width).toFixed(2)}%`,
                      height: `${(pieces?.main.h * 100 / canvas.height).toFixed(2)}%`,
                      transform:
                        `translateX(${j * 100}%) 
                        translateY(${i * 100}%)`,
                      boxShadow: "inset 0px 0px 0px 1px #38bdf8"
                    }}
                    className={`absolute rounded-sm duration-100 bg-white`}
                    key={`PIECE_${i}_${j}`} >
                  </div>)
              )
              )}
              {/* Margin Line */}
              <div className="absolute w-full h-full ">
                <div
                  style={{
                    paddingTop: paddingT,
                    paddingRight: paddingR,
                    paddingBottom: paddingB,
                    paddingLeft: paddingL
                  }}
                  className="relative flex w-full h-full">
                  <div
                    style={{ borderColor: paddingColor }}
                    className="w-full h-full border-2 border-dotted bordergreen-400 ">
                  </div>
                </div>
              </div>

              {/* Remain Space Pieces 
                {Array.from({ length: pieces.remain?.rows }).map((_, i) => (
                  Array.from({ length: pieces.remain?.cols }).map((_, j) =>
                    <div
                      style={{
                        width: `${(pieces.remain.w * 100 / canvas.width).toFixed(2)}%`,
                        height: `${(pieces.remain.h * 100 / canvas.height).toFixed(2)}%`,
                        transform:
                          `translateX(${j * 100}%) 
                        translateY(${i * 100}%)`,
                        left: pzaOrient === 'row' ?
                          `${(pieces.main.w * 100 / canvas.width * pieces.main.cols).toFixed(2)}%` : 0,
                        top: pzaOrient === 'col' ?
                          `${(pieces.main.h * 100 / canvas.height * pieces.main.rows).toFixed(2)}%` : 0,
                        boxShadow: "inset 0px 0px 0px 2px rgb(134 239 172)"
                      }}
                      className={` absolute  rounded-sm duration-100`}
                      key={`PIECE_R_${i}_${j}`} >
                    </div>)
                )
                )}
              */}
            </div>

            <div className="absolute right-0 text-lg font-semibold text-gray-700 -translate-y-full -top-0">
              {canvas.height} x {canvas.width} cm
            </div>

            <div
              className="absolute top-0 left-0 font-semibold text-gray-700 -translate-y-full">
              {piece.width}
            </div>

            <div
              style={{ right: '104%', top: 0 }}
              className={`absolute font-semibold text-gray-700 `}>
              {piece.height}
            </div>

            <div className="absolute flex items-center font-semibold text-gray-700 -bottom-14">
              <p className='pr-2 text-base italic'>
                Etiquetas:
              </p>
              <p className='text-lg'>
                {pieces?.main?.rows * pieces?.main?.cols * piece?.cortes }
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Visualizer