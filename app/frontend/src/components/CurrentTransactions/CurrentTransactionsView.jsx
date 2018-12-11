import React, { Component, Fragment } from 'react';
import Ad from 'components/Ad';
import Map from './Map';
import Table from './Table';
import NoTableEntries from './NoTableEntries';
import '../../styles/CurrentTransactionsView.css';
import { connect } from 'react-redux';
import { fetchTransaction } from '../../actions/table';


const loader = (
    <div className='loading-container'>
        <div className='loader-container d-flex justify-content-center'>
            <div className='loader'></div>
        </div>
        <div>
            <p className='text-center'>Your transaction is processing. Please wait.</p>
        </div>
    </div>
);

const errorMessage = (mostRecent, isFetchingTransaction) =>
    (mostRecent && mostRecent.error && !isFetchingTransaction) ?
        <div className='alert alert-danger' role='alert'>
            Something went wrong while trying to get the transaction.
            This is an issue with our servers and not the Nano network. Hold tight and try again.
        </div>
        : null;


class CurrentTransactionsView extends Component {
    render() {
        const { numToRerun, table, isFetchingTiming, isFetchingTransaction } = this.props;
        const mostRecent = table.length && table[table.length - 1];
        const sendMessage = mostRecent.completed ? 'Sent' : 'Sending';
        // render the jsx

        const shouldShowTable = (isFetchingTransaction || mostRecent || isFetchingTiming);
        return (
            <Fragment>
                <Ad/>
                <h2 className='map-header page-header text-left d-inline-block'>Your Transactions</h2>
                {errorMessage(mostRecent, isFetchingTransaction)} {/*Displays an error message if fetching the transaction fails*/}
                {(shouldShowTable) ?  // this is pretty ugly and should be refactored in V2
                    <Fragment>{
                        (isFetchingTransaction || !mostRecent) ? loader // show loader if no data or is getting a transaction
                            : <Fragment>
                                <div className='nano-container float-right'>
                                    <button id='rerun' className='btn btn-primary' onClick={
                                        () => this.props.onRerun(
                                            mostRecent.origin.id.toString(),
                                            mostRecent.destination.id.toString(),
                                            numToRerun,
                                            table)
                                    }>Rerun Test
                                    </button>
                                </div>
                                <Table tableData={table}/>
                                <h2 className='map-header page-header text-center'>
                                    {sendMessage} from {mostRecent.origin.nodeLocation} to {mostRecent.destination.nodeLocation}
                                    {isFetchingTiming &&
                                    <Fragment>
                                        <p/>
                                        This can take up to 30 seconds hold tight.
                                    </Fragment>
                                    }
                                </h2>
                                <div className='nano-container map-container text-center>'>
                                    <Map {...mostRecent}/>
                                </div>
                            </Fragment>
                    }</Fragment>
                    : <NoTableEntries/>
                }
            </Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRerun(origin, dest, multi, table) {
            if (multi > 1) {
                let transactions = [];
                for (let i = 1; i <= multi; i++) {
                    transactions.push({
                        originNodeId: table[table.length - i].origin.id.toString(),
                        destinationNodeId: table[table.length - i].destination.id.toString(),
                    });
                }
                transactions = transactions.reverse();
                dispatch(fetchTransaction(multi, {
                    transactions
                }));
            } else {
                dispatch(fetchTransaction(1, {
                    transactions: [{
                        originNodeId: origin,
                        destinationNodeId: dest
                    }]
                }));
            }
        }
    };
};


export default connect(null, mapDispatchToProps)(CurrentTransactionsView);