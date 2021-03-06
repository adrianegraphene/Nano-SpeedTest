import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Ad from 'components/Ad';
import PastResultsTable from './PastResultsTable';
import ScatterView from './ScatterView';
import HeatMap from './HeatMap';
import {addPastResults} from 'actions/pastResults';
import {fetchPastResults} from 'util/helpers';
import { Helmet } from "react-helmet";

class HistoricalDataView extends React.Component {
    componentDidMount() {
        fetchPastResults()
        .then((response) => {
            this.props.fetchedPastData({
                ...response
            });
        });
    }
    render() {
        const {pastTransactions, totalTransactions, globalAverage, nodeLocations} = this.props;
        const plotData = [];
        pastTransactions.sort((a,b) => a.endSendTimestamp - b.endSendTimestamp)
        .forEach((transaction, i) => {
            plotData.push({
                x: i,
                y: transaction.elapsedTime,
                date: transaction.endSendTimestamp,
                origin: transaction.origin.nodeLocation,
                destination: transaction.destination.nodeLocation,
                PoWCached: transaction.PoWCached,
            });
        });

        return (
            <div className='HistoricalData'>
             <Helmet>
                <title>NanoSpeed.live - Past Transaction Information</title>
                <meta name="keywords" content="Nano,speed test,cryptocurrency,bitcoin,instant,feeless" />
                <meta
                    name="description"
                    content="View statistics about past speed tests and transactions."
                 />
            </Helmet>

                <Ad />

                <div className='container-fluid'>
                        <div className='row form-group'>
                        <div className='container-fluid'>
                        <h1 className='map-header'>
                            Some Stats
                        </h1>
                            <div className='row form-group'>

                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Total Transactions Sent: {totalTransactions}
                                    </h3>
                                </div>
                                <div className='col-auto'>
                                    <h3 className='map-header'>
                                        Median 24h: {globalAverage.toFixed(3)} Seconds
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-lg-6'>
                            <h2 className='map-header text-center'>
                                Scatter Chart of Last 250 Transactions
                            </h2>
                            {
                                plotData && plotData.length ?
                                <ScatterView plotData={plotData}/>
                                : null
                            }
                        </div>
                        <div className='col-xs-12 col-sm-12 col-lg-6'>
                            <h2 className='map-header text-center'>
                                Locations of Our Nano Nodes
                            </h2>
                            { nodeLocations && nodeLocations.length ?
                                <HeatMap nodeLocations={nodeLocations} /> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                     <div className='col-12'>
                            <PastResultsTable tableData={pastTransactions}/>
                     </div>
                     </div>
                     Please do not use bots to access site. Excessive testing or spam will result in a swift 24 hour ban.
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pastTransactions: state.pastResults.pastTransactions,
        totalTransactions: state.pastResults.totalTransactions,
        globalAverage: state.pastResults.globalAverage,
        nodeLocations: state.nodes
    };
};

const mapDispatchToProps = (dispatch) => {
	return {
	  	fetchedPastData(data) {
			dispatch(addPastResults(data));
	  	}
	};
};

HistoricalDataView.propTypes = {
    pastTransactions: PropTypes.array.isRequired,
    totalTransactions: PropTypes.number,
    globalAverage: PropTypes.number,
    nodeLocations: PropTypes.array
};

HistoricalDataView.defaultProps = {
    totalTransactions: 0,
    globalAverage: 0,
};

export default connect(mapStateToProps,mapDispatchToProps)(HistoricalDataView);