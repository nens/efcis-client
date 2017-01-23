// @flow
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Router, Route, Link, browserHistory } from 'react-router'
import logo from '../images/logo.png';

// import {} from '../actions.jsx';

class TopNav extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentWillReceiveProps(newProps) {}

  render() {
    return (
      <nav className='navbar navbar-fixed-top'>
         <div className='container-fluid'>
           <div className='navbar-header'>
             <button type='button'
                     className='navbar-toggle collapsed'
                     data-toggle='collapse'
                     data-target='#navbar'
                     aria-expanded='false'
                     aria-controls='navbar'>
               <span className='sr-only'>Toggle navigation</span>
               <span className='icon-bar'></span>
               <span className='icon-bar'></span>
               <span className='icon-bar'></span>
             </button>
             <a className='navbar-brand logo'>
                 <img src={logo}
                      style={{margin:15, padding:0, margin: 0}}
                      height='40'
                      alt='EFCIS'/>
             </a>
           </div>
           <div id='navbar' className='navbar-collapse collapse' style={{backgroundColor:'#fff'}}>
             <ul className='nav navbar-nav navbar-left'>
               <li><Link to='/' activeClassName='active' activeStyle={{ backgroundColor: '#CCCCCC' }}><i className='fa fa-2x fa-table'></i></Link></li>
               <li><Link to='map' activeClassName='active' activeStyle={{ backgroundColor: '#CCCCCC' }}><i className='fa fa-2x fa-globe'></i></Link></li>
               <li><Link to='chart' activeClassName='active' activeStyle={{ backgroundColor: '#CCCCCC' }}><i className='fa fa-2x fa-line-chart'></i></Link></li>
             </ul>
             <ul className='nav navbar-nav navbar-right'>
               <li><a href={config.logoutUrl}>Uitloggen&nbsp;<i className='fa fa-sign-out'/></a></li>
             </ul>
           </div>
         </div>
       </nav>
     );
   }
 }

TopNav.propTypes = {};

export default TopNav;
