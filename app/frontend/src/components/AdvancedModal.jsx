import React, { Component } from 'react';
import Modal from 'react-modal';
import { Field, reduxForm } from 'redux-form';
import '../styles/Field.css';

// Need to make this a class component so it can have some local state
class AdvancedModal extends Component {
    state = {
        locationsActive: true,
        multipleActive: false,
    };

    // Having 2 separate sounds silly.  Is there a way to condense?
    setLocationsTab = () => {
        if (!this.state.locationsActive) {
            this.props.reset();
            this.setState(() => ({
                locationsActive: true,
                multipleActive: false
            }));
        }
    };

    setMultipleTab = () => {
        if (!this.state.multipleActive) {
            this.props.reset();
            this.setState(() => ({
                locationsActive: false,
                multipleActive: true
            }));
        }
    };

    render() {
        const { open, handleLocationSettings,handleMultiSettings, nodes, settings } = this.props;
        return (
            <Modal
                appElement={document.getElementById('root')}
                isOpen={open}
                contentLabel='Advanced Settings'
                style={{
                    content: {
                        bottom: 'auto',
                        width: 'auto',
                        maxWidth: '750px',
                        margin: 'auto',

                    }
                }}
            >
                <h3>Advanced Settings</h3>
                <hr/>
                {this.state.locationsActive ?
                    (
                        <div className='row'>
                            <div className='col-6'>
                                <button
                                    className='btn btn-primary col-12'
                                    onClick={this.setLocationsTab}
                                >Choose Locations
                                </button>
                            </div>
                            <div className='col-6'>
                                <button
                                    className='btn col-12'
                                    onClick={this.setMultipleTab}
                                >Multiple Transactions
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='row'>
                            <div className='col-6'>
                                <button
                                    className='btn col-12'
                                    onClick={this.setLocationsTab}
                                >Choose Locations
                                </button>
                            </div>
                            <div className='col-6'>
                                <button
                                    className='btn btn-primary col-12'
                                    onClick={this.setMultipleTab}
                                >Multiple Transactions
                                </button>
                            </div>
                        </div>
                    )}
                {this.state.locationsActive ?
                    (
                        <form onSubmit={handleLocationSettings}>
                            <div>
                                <p>Select the node locations that you want to be used for your test.</p>
                            </div>
                            <div>
                                <label>Origin</label>
                                <div>
                                    <Field name='origin' component='select' className='background-select noselect'>
                                        {
                                            nodes && nodes.filter(node => {
                                                if (settings && settings.advSettings && settings.advSettings.values //grab the origin nodes value and don't show it
                                                    && settings.advSettings.values.destination) {
                                                    return settings.advSettings.values.destination.toString() !== node.id.toString();
                                                } else {
                                                    return true;
                                                }
                                            }).map(node => {

                                                return <option
                                                    key={node.id}
                                                    value={node.id}
                                                >{node.location}</option>;
                                            })
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div>
                                <label>Destination</label>
                                <div>
                                    <Field name='destination' component='select'  className='background-select noselect'>
                                        {
                                            nodes && nodes.filter(node => {
                                                if (settings && settings.advSettings && settings.advSettings.values //grab the origin nodes value and don't show it
                                                    && settings.advSettings.values.origin) {
                                                    return settings.advSettings.values.origin.toString() !== node.id.toString();
                                                } else {
                                                    return true;
                                                }
                                            })
                                                .map(node => {
                                                    return <option
                                                        key={node.id}
                                                        value={node.id}
                                                    >{node.location}</option>;
                                                })
                                        }
                                    </Field>
                                </div>
                            </div>
                            <div>
                                <button
                                    id='submit'
                                    type='submit'
                                    className='btn btn-primary float-right col-4'
                                >Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleMultiSettings}>
                            <p>Select to send either 2 or 3 random transactions for your test.</p>
                            <div>
                                <div>
                                    <label><Field name='numTransactions' component='input' type='radio' value='2'/> 2
                                        Random Transactions</label>
                                </div>
                                <div>
                                    <label><Field name='numTransactions' component='input' type='radio' value='3'/> 3
                                        Random Transactions</label>
                                </div>
                            </div>
                            <div>
                                <button
                                    id='submit'
                                    type='submit'
                                    className='btn btn-primary float-right col-4'
                                >Save
                                </button>
                            </div>
                        </form>
                    )}
            </Modal>
        );
    }
}

// Allows form to communicate with store
AdvancedModal = reduxForm({
    form: 'advSettings'
})(AdvancedModal);

export default AdvancedModal;