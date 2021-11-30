const Topreplaybuttons = ({ onClick }) => {
  return (
    <>
      <ul className="list-inline top-button">
        <li onClick={onClick}>
          <button className="btn btn-light-gray">Reply</button>
        </li>
      </ul>
    </>
  );
};
export default Topreplaybuttons;
