import { useTranslation } from "react-i18next"
import { AdditionalHeaderText, FormContainer, InputTextArea, SubmitButton, formStatuses } from "../common/FormFields";
import { ErrorLabel } from "../common/UICommon";
import { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";

export const MessageCard = ({ item }) => {

    const { t } = useTranslation("SharedMessages");

    const dateFormatOptions = {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    const date = new Date(item.created_at);
    const sender = t("roles." + item.sender);

    return (
        <div className="card">
            <div className="p-2 card-body">
                {/* <ActionToolbar actions={actions} /> */}
                <h6 className="card-subtitle text-muted">{sender}, {date.toLocaleDateString(undefined, dateFormatOptions)}</h6>
                <p className="card-text text-ws-pre">{item.content} </p>
            </div>
        </div>
    )
}

const MessageListItem = ({ item, role }) => {
    const offset = (item?.sender === role) ? "offset-md-4" : ""

    return (
        <div className="row mt-1">
            <div className={"col-md-8 " + offset}><MessageCard item={item} /></div>
        </div>
    )
}

const MessageList = ({ items, role }) => {
    return (
        <div className="">
            <div className="row mt-1">
                {items.map((item, index) => <MessageListItem key={'Msg' + index} item={item} role={role} />)}
            </div>
        </div>
    )
}

const initialState = {
    content: ""
}

export const MessageForm = ({ messageList = [], onSubmit }) => {
    const [input, setInput] = useState(initialState);
    const [error, setError] = useState("")
    const [status, setStatus] = useState(formStatuses.initial)
    const [validationErrors, setValidationErrors] = useState({});

    const auth = useAuth()
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
                res[field] = t("form.errors.fieldIsRequired")
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
            setValidationErrors(errors)
            setStatus(formStatuses.pending)
            onSubmit(input.content)
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
                <FormContainer onSubmit={(event) => handleSubmit(event)} padding={3}>

                    <AdditionalHeaderText text={t("list.header")} />
                    <MessageList items={messageList ?? []} role={auth.user.role} />

                    <AdditionalHeaderText text={t("form.header")} />
                    <InputTextArea id="content" name="content" value={input.content} label={""}
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