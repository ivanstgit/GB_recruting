import React from "react";

export default function Footer(props) {
  return (
    <div className="container-fluid bg-dark text-light footer wow fadeIn">
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              {props.note}
            </div>
            <div className="col-md-6 text-center text-md-end">
              Designed By <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
