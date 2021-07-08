'use strict';

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Picker from 'react-month-picker'

import ChevronDown16 from '@carbon/icons-react/lib/chevron--down/16';

var yymmdd_ref = require("../../../data/yymmdd_ref.json");

    class MonthBox extends Component {
        constructor(props, context) {
            super(props, context)
            this.state = {
              value1: this.props.value1 || 'N/A',
              value2: this.props.value2 || 'N/A'
            }
            this._handleClick = this._handleClick.bind(this)
        }

        componentWillReceiveProps(nextProps){
            this.setState(
              { value1: nextProps.value1 || 'N/A',
                value2: nextProps.value2 || 'N/A'
              }
          )
        }

        render() {
            return (
                <div className="f-month-picker--month-box" onClick={this._handleClick}>
                    <span>{this.state.value1}</span><span className="bx--label bx--label--inline-dates">to</span><span>{this.state.value2}</span>
                    <span className="chevron-down"><ChevronDown16 /></span>
                </div>
            )
        }

        _handleClick(e) {
            this.props.onClick && this.props.onClick(e)
        }
    }


    MonthBox.propTypes = {
        value: PropTypes.string,
        onClick: PropTypes.func,
    }


    class List extends Component {
        constructor(props, context) {
            super(props, context)

            const { years, months }= this.props.defaultSelect;
            // console.log("defaultSelect");
            // console.log(this.props.defaultSelect);
            this.state = {
                mrange2: {from: {year: years[0], month: months[0]}, to: {year: years[1], month: months[1]}}, //default setting
            }

            this.handleClickMonthBox = this.handleClickMonthBox.bind(this)
            this.handleAMonthChange = this.handleAMonthChange.bind(this)
            this.handleAMonthDissmis = this.handleAMonthDissmis.bind(this)

            this.handleClickMonthBox2 = this.handleClickMonthBox2.bind(this)
            this.handleAMonthChange2 = this.handleAMonthChange2.bind(this)
            this.handleAMonthDissmis2 = this.handleAMonthDissmis2.bind(this)

            this._handleClickRangeBox = this._handleClickRangeBox.bind(this)
            this.handleRangeChange = this.handleRangeChange.bind(this)
            this.handleRangeDissmis = this.handleRangeDissmis.bind(this)

            this._handleClickRangeBox2 = this._handleClickRangeBox2.bind(this)
            this.handleRangeChange2 = this.handleRangeChange2.bind(this)
            this.handleRangeDissmis2 = this.handleRangeDissmis2.bind(this)
        }

        componentWillReceiveProps(nextProps){
            this.setState({
                value: nextProps.value || 'N/A',
            })
        }

        render() {

            const pickerLang = {
                months: yymmdd_ref.months, //drawing monthData from global month reference json (data/month_ref.json)
                from: 'From', to: 'To',
            }
            const mvalue = this.state.mvalue
                , mvalue2 = this.state.mvalue2
                , mrange = this.state.mrange
                , mrange2 = this.state.mrange2

            const makeText = m => {
                if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
                return '?'
            }

            const { years, months } = this.props.dateRange

            return (
                <ul>
                    <li>
                        <label className="bx--label"><b>From</b></label>
                        <div className="edit">
                            <Picker
                                ref="pickRange2"
                                years={{min: {year: years[0], month: months[0]}, max: {year: years[1], month: months[1]}}}
                                range={mrange2}
                                lang={pickerLang}
                                theme="dark"
                                onChange={this.handleRangeChange2}
                                onDismiss={this.handleRangeDissmis2}
                            >
                                <MonthBox value1={makeText(mrange2.from)} value2={makeText(mrange2.to)} onClick={this._handleClickRangeBox2} />
                            </Picker>
                        </div>
                    </li>
                </ul>
            )
        }

        handleClickMonthBox(e) {
            this.refs.pickAMonth.show()
        }
        handleAMonthChange(value, text) {
            //
        }
        handleAMonthDissmis(value) {
            this.setState( {mvalue: value} )
        }

        handleClickMonthBox2(e) {
            this.refs.pickAMonth2.show()
        }
        handleAMonthChange2(value, text) {
            //
        }
        handleAMonthDissmis2(value) {
            this.setState( {mvalue2: value} )
        }

        _handleClickRangeBox(e) {
            this.refs.pickRange.show()
        }
        handleRangeChange(value, text, listIndex) {
            //
        }
        handleRangeDissmis(value) {
            this.setState( {mrange: value} )
        }

        _handleClickRangeBox2(e) {
            this.refs.pickRange2.show()
        }
        handleRangeChange2(value, month, listIndex) {
            // console.log("value: "+ value);
            // console.log("month: "+ month);
            // console.log("listIndex: "+ listIndex);
        }
        handleRangeDissmis2(newDateRange) {
            this.setState( {mrange2: newDateRange} )
            this.props.onDateRangeSet(newDateRange);

        }
    }



    class FMonthPicker extends Component {
        constructor(props, context) {
            super(props, context)

            this.state = { value: this.props.value }
        }

        componentWillReceiveProps(nextProps){
            this.setState({ value: nextProps.value })
        }

        render() {
            return (
                <div className="list-area f-month-picker">
                    <List
                      onDateRangeSet={this.props.onDateRangeSet}
                      defaultSelect={this.props.defaultSelect}
                      dateRange={this.props.dateRange}
                    />
                </div>
            )
        }
    }

    FMonthPicker.propTypes = {
        value: PropTypes.string,
        onClick: PropTypes.func,
    }

export default FMonthPicker;
