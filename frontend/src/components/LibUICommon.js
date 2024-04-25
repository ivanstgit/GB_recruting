export const ErrorLabel = ({ errorText }) => {
    if (errorText && errorText !== "") {
        return (
            <div className="col-12 mt-1">
                <div className="alert alert-danger" role="alert">
                    {errorText}
                </div>
            </div>
        );
    } else {
        return <div />
    }
};

export const WarningLabel = ({ text }) => {
    if (text && text !== "") {
        return (
            <div className="col-12 mt-1">
                <div className="alert alert-warning" role="alert">
                    {text}
                </div>
            </div>
        );
    } else {
        return <div />
    }
};

export const SuccessLabel = ({ text }) => {
    if (text && text !== "") {
        return (
            <div className="col-12 mt-1">
                <div className="alert alert-success" role="alert">
                    {text}
                </div>
            </div>
        );
    } else {
        return <div />
    }
};

const PaginatorItem = ({ key, item, onClick }) => {
    const isActiveStyle = item.isActive ? " active" : ""

    return (
        <li className={"page-item " + isActiveStyle}>
            <button key={key} className="page-link" onClick={onClick()}>{item.page}</button>
        </li>
    )
}

export const Paginator = ({ selectedPage, pagesCount, onPageSelect }) => {

    const arrayRange = (start, stop, step) =>
        Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
        );
    const items = arrayRange(1, pagesCount, 1)

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                    <button className="page-link" onClick={onPageSelect()} tabindex="-1">&laquo;</button>
                </li>
                {items.map((item, index) => <PaginatorItem key={'NavLocItem' + index} caption={item} index={index} />)}
                <li className="page-item disabled">
                    <button className="page-link" onClick={onPageSelect()} tabindex="-1">&laquo;</button>
                </li>
            </ul>
        </nav>)
}

const NameValueTableItem = ({ name, value }) => {
    return (
        <tr>
            <th scope="row">{name}</th>
            <td>{value}</td>
        </tr>
    )
}

export const NameValueTable = ({ items, nameField = "name", valueField = "value", key = "NVT" }) => {
    return (
        <div className="table-responsive table-borderless">
            <table className="table">
                <thead>
                </thead>
                <tbody>
                    {items.map((item, index) => <NameValueTableItem
                        key={key + index}
                        name={item?.[nameField] ?? ""}
                        value={item?.[valueField] ?? ""}
                    />)}
                </tbody>
            </table>
        </div>
    )
}