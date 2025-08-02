import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="h-[86px] px-10 flex items-center justify-between gap-5">
      <p>Logo...</p>
      <nav className="w-100">
        <ul className="flex items-center justify-start gap-5">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">Shop</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/cart">Cart</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
