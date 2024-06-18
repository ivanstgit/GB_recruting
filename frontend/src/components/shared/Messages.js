import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const MessageCard = ({ item }) => {

    const { t } = useTranslation("SharedMessages");

    const dateFormatOptions = {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    const date = new Date(item.created_at)
    const sender = t("roles." + item.sender)

    return (
        <div className="card">
            <div className="p-3 card-body">
                {/* <ActionToolbar actions={actions} /> */}
                <div className="row g-3">
                    <p className="card-text text-muted">{sender}, {date.toLocaleDateString(undefined, dateFormatOptions)}</p>
                    <p className="card-text text-ws-pre">{item.content} </p>
                </div>
            </div>
        </div>
    )
}

const MessageListItem = ({ item, role }) => {
    if (item?.role === role) return (
        <div className="row g-3">
            <div className="col-4">nbsp;</div>
            <div className="col-8"><MessageCard item={item} /></div>
        </div>
    )
    return (
        <div className="row g-3">
            <div className="col-8"><MessageCard item={item} /></div>
            <div className="col-4">nbsp;</div>
        </div>
    )
}

export const MessageList = ({ items, role }) => {

    const { t } = useTranslation("SharedMessages");

    return (
        <div className="">
            <div className="row g-3 mt-1">
                <div className="text-center mx-auto mb-1 wow fadeInUp" data-wow-delay="0.1s">
                    <h2>{t("list.header")}</h2>
                </div>
            </div>

            <div className="row g-3">
                {items.map((item, index) => <MessageListItem key={'Msg' + index} item={item} role={role} />)}
            </div>
        </div>
    )
}

const initialState = {
    content: ""
}

export const MessageAddForm = ({ onSubmit }) => {
    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.initial)
    const [validationErrors, setValidationErrors] = useState({});

    const { t } = useTranslation("SharedMessages");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const validateInput = () => {
        const res = {}

        const fields = Object.keys(initialState)

        for (const index in fields) {
            let field = fields[index]

            if (input[field] === initialState[field]) {
                res[field] = t("errors.fieldIsRequired")
            }
        }

        return res
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validateInput()

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            setStatus(formStatuses.error)
        } else {
            setStatus(formStatuses.pending)
            onSubmit(input)
                .then((res) => {
                    if (res.error) {
                        setError(res.error)
                        setStatus(formStatuses.error)
                    } else {
                        setError("")
                        setInput(initialState)
                        setStatus(formStatuses.initial)
                    }
                })
        }
    }

    return (
        <div>
            <div className="row">
                <FormContainer onSubmit={(event) => handleSubmit(event)}>
                    <HeaderText text={t("form.header")} />

                    <InputText id="content" name="content" value={input.info} label={""}
                        errorText={validationErrors?.content ?? ""}
                        onChange={(event) => handleChange(event)} />

                    <div className="col-12">
                        <SubmitButton label={t("form.submit")}
                            disabled={(status === formStatuses.pending || status === formStatuses.prefilling)} />
                    </div>
                    <ErrorLabel errorText={error} />
                </FormContainer>
            </div>
        </div>
    );
}