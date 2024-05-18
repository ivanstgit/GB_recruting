import { useTranslation } from 'react-i18next';


const ModeratorHomePage = () => {
    const { t } = useTranslation("Moderator");
    return (
        <div>
            <h3> {t("Home.header")} </h3>
            <p> {t("Home.content")} </p>
        </div>
    )
}
export default ModeratorHomePage