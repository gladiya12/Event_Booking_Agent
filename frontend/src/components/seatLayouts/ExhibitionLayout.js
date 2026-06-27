function ExhibitionLayout({
  renderCinemaRows
}) {
  return (
    <>
      {renderCinemaRows(
        ["A","B","C","D"],
        6,
        18,
        6,
        "Exhibition Hall",
        300
      )}
    </>
  );
}

export default ExhibitionLayout; 