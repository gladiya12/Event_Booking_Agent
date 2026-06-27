function TheatreLayout({
  renderCinemaRows
}) {
  return (
    <>
      {renderCinemaRows(
        ["A","B","C","D","E"],
        5,
        14,
        5,
        "Balcony",
        600
      )}

      {renderCinemaRows(
        ["F","G","H","I","J"],
        5,
        12,
        5,
        "First Class",
        400
      )}

      {renderCinemaRows(
        ["K","L","M"],
        5,
        10,
        5,
        "Second Class",
        250
      )}
    </>
  );
}

export default TheatreLayout;