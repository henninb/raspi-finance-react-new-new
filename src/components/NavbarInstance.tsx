import React from "react";
import SelectAccounts from "./SelectAccounts";
import { Link } from "react-router-dom";
import "./main.scss";

export default function NavbarInstance() {
  return (
    <div>
      {/*<nav className="navbar navbar-expand-sm nav-purple navbar-light fixed-top font-weight-bold">*/}
      {/*  <Link className="navbar-brand" to="/">*/}
      {/*    FinanceApp*/}
      {/*  </Link>*/}

      {/*  <ul className="navbar-nav">*/}
      {/*    <li className="nav-item font-weight-bold">*/}
      {/*      <Link*/}
      {/*        className="nav-link"*/}
      {/*        to="/payments"*/}
      {/*        data-test-id="payments-link"*/}
      {/*      >*/}
      {/*        Payments*/}
      {/*      </Link>*/}
      {/*    </li>*/}
      {/*    <li className="nav-item font-weight-bold">*/}
      {/*      <Link*/}
      {/*        className="nav-link"*/}
      {/*        to="/payment/required"*/}
      {/*        data-test-id="payment-required-link"*/}
      {/*      >*/}
      {/*        PaymentRequired*/}
      {/*      </Link>*/}
      {/*    </li>*/}
      {/*    <li className="nav-item">*/}
      {/*      <Link*/}
      {/*        className="nav-link"*/}
      {/*        to="/freeform"*/}
      {/*        data-test-id="freeform-link"*/}
      {/*      >*/}
      {/*        FreeForm*/}
      {/*      </Link>*/}
      {/*    </li>*/}
      {/*    <li>*/}
      {/*      <SelectAccounts />*/}
      {/*    </li>*/}
      {/*  </ul>*/}
      {/*</nav>*/}

      {/*<nav className="navbar navbar-expand-sm nav-purple navbar-light fixed-top font-weight-bold">*/}
      <nav className="navbar navbar-expand-lg navbar-light navbar-fixed-top">
        {/*<a className="navbar-brand" href="#">*/}
        {/*  Navbar*/}
        {/*</a>*/}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              {" "}
              <a className="nav-link" href="/">
                Home<span className="sr-only">(current)</span>
              </a>{" "}
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/payments">
                Payments
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/payment/required">
                Payment Required
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/freeform">
                FreeForm
              </a>
            </li>
            <li className="nav-item">
              {" "}
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
        <SelectAccounts />
      </nav>
    </div>
  );
}
