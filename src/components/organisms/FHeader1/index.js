import React, { useState, useEffect, Fragment } from "react";
import {Link, useHistory} from "react-router-dom";
import {
  Header,
  HeaderName,
  HeaderContainer,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderMenuButton,
  HeaderGlobalBar,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
  HeaderMenu,
  HeaderGlobalAction
} from "carbon-components-react/lib/components/UIShell";

import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import MediaQuery, { useMediaQuery } from "react-responsive";

import OverflowMenuVertical20 from '@carbon/icons-react/lib/overflow-menu--vertical/20';

import Logo from '../../../imgs/logo_obi.png';

const FHeader1 = () => {

  let history = useHistory();

  const [ screenWidth, setScreenWidth ] = useState(window.innerWidth);

  const handleRouting = (route) => history.push(route)

  const desktopSecondaryLinks = <Fragment>
                                  <HeaderMenuItem element={Link} to="/glossary">
                                    Glossary
                                  </HeaderMenuItem>
                                  <HeaderMenuItem element={Link} to='/aboutus'>
                                    About Us
                                  </HeaderMenuItem>
                                  <HeaderMenuItem>
                                    <a className='f-header-link' href="https://openbudgetsindia.org/contact" target="_blank">Contact Us</a>
                                  </HeaderMenuItem>
                                </Fragment>

  const mobileSecondaryLinks =  <OverflowMenu
                                flipped="true"
                                renderIcon = {() => <div><OverflowMenuVertical20 style={{fill: "white"}} /></div>}
                                >
                                  <OverflowMenuItem itemText="Glossary" onClick={() => handleRouting('/glossary')}/>
                                  <OverflowMenuItem itemText="About Us" onClick={() => handleRouting('/aboutus')}/>
                                  <a href="https://openbudgetsindia.org/contact" target="_blank"><OverflowMenuItem itemText="Contact Us" /></a>
                                </OverflowMenu>


  return(
    <HeaderContainer
      render={({isSideNavExpanded, onClickSideNavExpand}) => (
        <div className='f-header'>
          <Header aria-label="Carbon Tutorial">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName element={Link} to="/" prefix="">
              <img src={Logo} alt='' />
            </HeaderName>
            <HeaderNavigation className="f_primarylinks_center" aria-label="HP Fiscal Data Explorer Primary Links">
              <HeaderMenuItem element={Link} to="/expenditure/summary">Expenditure Summary</HeaderMenuItem>
              <HeaderMenuItem element={Link} to="/expenditure/tracker">Expenditure District-wise</HeaderMenuItem>
              {/*<HeaderMenu aria-label="Expenditure" menuLinkName="Expenditure">
                //<HeaderMenuItem element={Link} to="/expenditure/summary">Summary</HeaderMenuItem>
                <HeaderMenuItem element={Link} to="/expenditure/details">Demand Details</HeaderMenuItem>
                <HeaderMenuItem element={Link} to="/expenditure/tracker">District Comparison</HeaderMenuItem>
              </HeaderMenu>*/}
              <HeaderMenu aria-label="Receipts" menuLinkName="Receipts">
                <HeaderMenuItem element={Link} to="/receipts">Details</HeaderMenuItem>
                <HeaderMenuItem element={Link} to="/receipts/districtwise">Districtwise</HeaderMenuItem>
              </HeaderMenu>
              <HeaderMenuItem element={Link} to="/schemes">Schemes</HeaderMenuItem>
              <HeaderMenuItem element={Link} to="/expenditure/covid19">COVID-19</HeaderMenuItem>
            </HeaderNavigation>
            <HeaderNavigation className="f_secondarylinks_right" aria-label="HP Fiscal Data Explorer Secondary Links">
            { screenWidth >= 1225 ? desktopSecondaryLinks : <div></div> }
            </HeaderNavigation>
            <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isPersistent={false}>
              <SideNavItems>
                <HeaderSideNavItems>
                  <HeaderMenu aria-label="Expenditure" menuLinkName="Expenditure">
                    <HeaderMenuItem
                      element={Link}
                      to="/expenditure/summary"
                      onClick={onClickSideNavExpand}
                    >
                      Summary
                    </HeaderMenuItem>
                    {/*<HeaderMenuItem
                      element={Link}
                      to="/expenditure/details"
                      onClick={onClickSideNavExpand}
                    >
                      Demand Details
                    </HeaderMenuItem>*/}
                    <HeaderMenuItem
                      element={Link}
                      to="/expenditure/tracker"
                      onClick={onClickSideNavExpand}
                    >
                      Districtwise
                    </HeaderMenuItem>
                  </HeaderMenu>
                  <HeaderMenu aria-label="Receipts" menuLinkName="Receipts">
                    <HeaderMenuItem
                      element={Link}
                      to="/receipts"
                      onClick={onClickSideNavExpand}
                    >
                      Details
                    </HeaderMenuItem>
                    <HeaderMenuItem
                      element={Link}
                      to="/receipts/districtwise"
                      onClick={onClickSideNavExpand}
                    >
                      Districtwise
                    </HeaderMenuItem>
                  </HeaderMenu>
                  <HeaderMenuItem
                    element={Link}
                    to="/aboutus"
                    onClick={onClickSideNavExpand}
                  >
                    About Us
                  </HeaderMenuItem>
                  <HeaderMenuItem
                    element={Link}
                    to="/contactus"
                    onClick={onClickSideNavExpand}
                  >
                    Contact Us
                  </HeaderMenuItem>
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
            <HeaderGlobalBar />
            { screenWidth < 1225 ? mobileSecondaryLinks : <div></div> }
          </Header>
        </div>
      )}
    />
  );
}
export default FHeader1;
