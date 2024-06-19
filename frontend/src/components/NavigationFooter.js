import React from "react";
import { useTranslation } from "react-i18next";

export default function NavigationFooter(props) {
  const { t } = useTranslation("Navigation");
  return (
    <div className="container-fluid bg-dark text-light footer wow fadeIn">
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              {t("Footer.Note")}
            </div>
            <div className="col-md-6 text-center text-md-end">
              {t("Footer.DesignedBy")} <a className="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
