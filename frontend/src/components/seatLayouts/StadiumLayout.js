function StadiumLayout({
  renderCinemaRows
}) {
  return (
    <>
      {renderCinemaRows(
        ["A","B","C","D"],
        4,
        18,
        4,
        "Diamond",
        500
      )}

      {renderCinemaRows(
        ["E","F","G","H","I"],
        4,
        20,
        4,
        "Gold",
        350
      )}

      {renderCinemaRows(
        ["J","K","L","M","N"],
        4,
        14,
        4,
        "Silver",
        200
      )}
    </>
  );
}

export default StadiumLayout;