// define a single box for a bit of core-mask
interface SquareBoxProps {
  id: number
  startTime: string
  endTime: string
  size: [number, number]
  onClick: (id: number) => void
  clicked: boolean
  masked: boolean
}

const SquareBox: React.FC<SquareBoxProps> = ({
  id,
  startTime,
  endTime,
  size,
  clicked,
  onClick,
  masked,
}) => {
  const boxStyle: React.CSSProperties = {
    width: `${size[0]}px`,
    height: `${size[1]}px`,
    backgroundColor: masked ? 'lightgray' : clicked ? '#FA857B' : 'gray',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid gray',
    cursor: 'pointer',
    borderRadius: '10px',
  }

  return (
    <div style={boxStyle} onClick={() => onClick(id)} title={`Start: ${startTime} End: ${endTime}`}>
      <p className="text-sm font-bold">{id + 1}</p>
    </div>
  )
}

export default SquareBox
