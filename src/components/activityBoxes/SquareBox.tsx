// define a single box for a bit of core-mask
interface SquareBoxProps {
  id: number
  startTime: string
  endTime: string
  size: [number, number]
  onClick: (id: number) => void
  clicked: boolean
}

const SquareBox: React.FC<SquareBoxProps> = ({
  id,
  startTime,
  endTime,
  size,
  clicked,
  onClick,
}) => {
  const boxStyle: React.CSSProperties = {
    width: `${size[0]}px`,
    height: `${size[1]}px`,
    backgroundColor: clicked ? 'green' : 'gray',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid gray',
    cursor: 'pointer',
  }

  return (
    <div style={boxStyle} onClick={() => onClick(id)}>
      <p className="text-sm font-bold">{id + 1}</p>
      {/* <p>Start: {startTime}</p>
            <p>End: {endTime}</p> */}
    </div>
  )
}

export default SquareBox
