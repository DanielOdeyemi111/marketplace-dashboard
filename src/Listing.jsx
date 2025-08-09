function Listing({ title, price, location }) {
  return (
    <div className="listing">
      <h3>{title}</h3>
      <p>Price: ${price}</p>
      <p>Location: {location}</p>
    </div>
  );
}

export default Listing;