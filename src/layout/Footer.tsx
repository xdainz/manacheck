import useTranslation from "../hooks/useTranslation";

function Footer() {
    const { t } = useTranslation();

    return (
        <>
            <div className="footer mb-3 text-center">
                <a
                    href="https://github.com/xdainz/manacheck"
                    target="_blank"
                    className="brand"
                >
                    Manacheck
                </a>{" "}
                {t("footer.developedBy")}{" "}
                <a href="https://github.com/xdainz" target="_blank">
                    xdainz
                </a>
            </div>
        </>
    );
}

export default Footer;
