function ConferenceLayout({
  renderCinemaRows
}) {
  return (
    <>
      {renderCinemaRows(
        ["A","B","C"],
        3,
        8,
        3,
        "Conference",
        500
      )}

      {renderCinemaRows(
        ["D","E","F"],
        3,
        8,
        3,
        "General",
        350
      )}
    </>
  );
}

export default ConferenceLayout;