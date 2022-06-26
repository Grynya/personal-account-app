import {Container, Table} from "reactstrap";

export default function PaymentsTable(props) {
    if (props.registrarsWithPayments) {
        return (<Container>
            <Table hidden={props.hidden} style={{ borderCollapse: "separate", borderSpacing: "15px 20px" }}>
                <tr>
                    <th>Дата начала</th>
                    <th>Дата конца</th>
                    <th>Сумма</th>
                </tr>
                {props.registrarsWithPayments.map((payment, idx) => {
                    return (
                        <tr id={idx}>
                            <td>{convertDate(payment.paidFrom)}</td>
                            <td>{convertDate(payment.paidUntil)}</td>
                            <td>{payment.amount}</td>
                        </tr>)
                })}
            </Table>
        </Container>)
    }else return <></>
}
function convertDate(date){
    if (date.match("^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$")){
        let newDate = date.split("-");
        return newDate[2]+"."+newDate[1]+"."+newDate[0]
    }return date
}
