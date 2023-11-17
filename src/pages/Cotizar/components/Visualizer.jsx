import React, { useEffect, useRef, useState } from 'react'
const Visualizer = ({
  canvas,
  piece,
}) => {

  const materialRef = useRef()

  const [pcOrient, setPcOrient] = useState(null)
  const [pieces, setPieces] = useState({ main: {}, remain: {} })

  useEffect(() => {

    //console.log('canvas:', canvas)
    //console.log('piece:', piece)

    
    // assumming piece Vertically
    let v_cols = Math.floor(canvas.width / piece.height)
    let v_rows = Math.floor(canvas.height / piece.width)
    let v_space_remain = canvas.height - v_rows * piece.width
    let v_cols_remain = Math.floor(canvas.width / piece.width)
    let v_rows_remain = Math.floor(v_space_remain / piece.height)

    let q2 = v_cols * v_rows + (v_cols_remain * v_rows_remain || 0)

    // assumming piece horizontally
    let h_cols = Math.floor(canvas.width / piece.width)
    let h_rows = Math.floor(canvas.height / piece.height)
    let h_space_remain = canvas.width - h_cols * piece.width
    let h_cols_remain = Math.floor(h_space_remain / piece.height)
    let h_rows_remain = Math.floor(canvas.height / piece.width)

    let q1 = h_cols * h_rows + (h_cols_remain * h_rows_remain || 0)

    setPcOrient(q1 > q2 ? 'row' : 'col')

    if (q1 > q2) {
      setPieces({
        main: { rows: h_rows, cols: h_cols, w: piece.width, h: piece.height },
        remain: { rows: h_rows_remain, cols: h_cols_remain, w: piece.height, h: piece.width }
      })
    } else {
      setPieces({
        main: { rows: v_rows, cols: v_cols, w: piece.height, h: piece.width },
        remain: { rows: v_rows_remain, cols: v_cols_remain, w: piece.width, h: piece.height },
      })
    }
    //console.log("q1:", q1, "q2:", q2)
    //console.log('Horisontally', h_cols, h_rows, h_cols_remain, h_rows_remain)
    //console.log('Vertically', v_cols, v_rows, v_cols_remain, v_rows_remain)
    //console.log(q1, q2)

  }, [piece, canvas])

  if (!canvas.height || canvas.height === 0 ||
    !canvas.width || canvas.width === 0 ||
    !piece.width || piece.width === 0 ||
    !piece.height || piece.height === 0 ||
    pieces.main.rows === Infinity || pieces.main.cols === Infinity ||
    pieces.remain.rows === Infinity || pieces.remain.cols === Infinity

  ) return <></>

  return (
    <div className='flex flex-col w-full h-full total-center'>
      <div
        style={{ boxShadow: '3px 3px 10px 3px inset #eee' }}
        className=' p-[3rem] border rounded-lg w-[25rem] h-[25rem] total-center bg-neutral-100'>
        <div
          ref={materialRef}
          className='relative bg-white shadow-md total-center'
          style={{
            height: `${(canvas?.height * 100 / canvas?.width).toFixed(2)}%`,
            width: '100%'
          }}>


          <div className={`h-full w-full relative`}>
            {/* Main Space Pieces */}
            {Array.from({ length: pieces.main?.rows }).map((_, i) => (
              Array.from({ length: pieces.main?.cols }).map((_, j) =>
                <div
                  style={{
                    width: `${(pieces.main.w * 100 / canvas.width).toFixed(2)}%`,
                    height: `${(pieces.main.h * 100 / canvas.height).toFixed(2)}%`,
                    transform:
                      `translateX(${j * 100}%) 
                       translateY(${i * 100}%)`,
                    boxShadow: "inset 0px 0px 0px 2px rgb(134 239 172)"
                  }}
                  className={` absolute  rounded-sm duration-100`}
                  key={`PIECE_${i}_${j}`} >

                </div>)
            )
            )}
            {/* Remain Space Pieces */}
            {Array.from({ length: pieces.remain?.rows }).map((_, i) => (
              Array.from({ length: pieces.remain?.cols }).map((_, j) =>
                <div
                  style={{
                    width: `${(pieces.remain.w * 100 / canvas.width).toFixed(2)}%`,
                    height: `${(pieces.remain.h * 100 / canvas.height).toFixed(2)}%`,
                    transform:
                      `translateX(${j * 100}%) 
                    translateY(${i * 100}%)`,
                    left: pcOrient === 'row' ?
                      `${(pieces.main.w * 100 / canvas.width * pieces.main.cols).toFixed(2)}%` : 0,
                    top: pcOrient === 'col' ?
                      `${(pieces.main.h * 100 / canvas.height * pieces.main.rows).toFixed(2)}%` : 0,
                    boxShadow: "inset 0px 0px 0px 2px rgb(134 239 172)"
                  }}
                  className={` absolute  rounded-sm duration-100`}
                  key={`PIECE_R_${i}_${j}`} >
                </div>)
            )
            )}
          </div>

          <div className="absolute -translate-y-full text-emerald-600 -top-2">
            {canvas.width} cm
          </div>
          <div className="absolute -translate-x-full text-emerald-600 -left-2">
            {canvas.height} cm
          </div>
        </div>
      </div>

    </div>
  )
}

export default Visualizer