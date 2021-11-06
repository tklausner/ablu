import Paper from '@material-ui/core/Paper';

const Tile = ({ backgroundColor, className }) => {
  return (
    <Paper
      className={className}
      style={{
        backgroundColor: backgroundColor,
      }}
    />
  );
};

export default Tile;
