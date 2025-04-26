interface SpaceShipInfoProps {
  tries: number;
}

const SpaceShipInfo = ({ tries }: SpaceShipInfoProps) => {
  return (
    <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 500 }}>
      🚀 Tries Left: {tries}
    </div>
  );
};

export default SpaceShipInfo;
