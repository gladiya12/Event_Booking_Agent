function AuditoriumLayout({
  renderCinemaRows
}) {
  return (
    <>
      {renderCinemaRows(
        ["A","B","C","D"],
        4,
        12,
        4,
        "Premium",
        500
      )}

      {renderCinemaRows(
        ["E","F","G","H","I"],
        4,
        10,
        4,
        "Standard",
        350
      )}

      {renderCinemaRows(
        ["J","K","L"],
        4,
        8,
        4,
        "Economy",
        200
      )}
    </>
  );
}

export default AuditoriumLayout;