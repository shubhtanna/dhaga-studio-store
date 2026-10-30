import { useEffect, useState } from "react";

const rupees = (n) => "₹" + n.toLocaleString("en-IN");

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    fetch("/products.json")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const lines = products.filter((p) => cart[p.id]);
  const total = lines.reduce((s, p) => s + p.price * cart[p.id], 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="page">
      <header>
        <h1>Dhaga Studio</h1>
        <p>Handloom scarves, shawls and stoles from Indian weavers</p>
        <button className="cart-btn" onClick={() => setOpen(!open)}>
          Cart ({count})
        </button>
      </header>

      {open && (
        <section className="cart">
          <h2>Your cart</h2>
          {placed ? (
            <p>Thank you! Your order has been placed.</p>
          ) : lines.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {lines.map((p) => (
                <div className="line" key={p.id}>
                  <span>{p.name} × {cart[p.id]}</span>
                  <span>{rupees(p.price * cart[p.id])}</span>
                </div>
              ))}
              <div className="line total"><span>Total</span><span>{rupees(total)}</span></div>
              <button onClick={() => { setPlaced(true); setCart({}); }}>Place order</button>
            </>
          )}
        </section>
      )}

      <main className="grid">
        {products.map((p) => (
          <article className="card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <div className="row">
              <strong>{rupees(p.price)}</strong>
              <button onClick={() => add(p.id)}>Add to cart</button>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
