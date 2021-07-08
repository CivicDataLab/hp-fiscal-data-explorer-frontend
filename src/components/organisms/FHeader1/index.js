import React, { useState, useEffect, Fragment } from "react";
import {Link} from "react-router-dom";
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

const FHeader1 = () => {


  const [ screenWidth, setScreenWidth ] = useState(window.innerWidth);




  const desktopSecondaryLinks = <Fragment>
                                  <HeaderMenuItem element={Link} to="/aboutus">
                                    About Us
                                  </HeaderMenuItem>
                                  <HeaderMenuItem element={Link} to="/contactus">
                                    Contact Us
                                  </HeaderMenuItem>
                                </Fragment>

  const mobileSecondaryLinks =  <OverflowMenu
                                flipped="true"
                                renderIcon = {() => <div><OverflowMenuVertical20 style={{fill: "white"}} /></div>}
                                >
                                  <OverflowMenuItem itemText="About Us" primaryFocus />
                                  <OverflowMenuItem itemText="Contact Us" />
                                </OverflowMenu>


  return(
    <HeaderContainer
      render={({isSideNavExpanded, onClickSideNavExpand}) => (
        <div>
          <Header aria-label="Carbon Tutorial">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName element={Link} to="/" prefix="">
              Fiscal Data Explorer
            </HeaderName>
            <HeaderNavigation className="f_primarylinks_center" aria-label="Carbon Tutorial">
              <HeaderMenu aria-label="Expenditure" menuLinkName="Expenditure">
                <HeaderMenuItem element={Link} to="/expenditure/summary">Summary</HeaderMenuItem>
                <HeaderMenuItem element={Link} to="/expenditure/details">Demand Details</HeaderMenuItem>
                <HeaderMenuItem element={Link} to="/expenditure/tracker">District Comparison</HeaderMenuItem>
                {/*<HeaderMenuItem element={Link} to="/expenditure/district_details">District Details</HeaderMenuItem>*/}
              </HeaderMenu>
              <HeaderMenuItem element={Link} to="/receipts">
                Receipts
              </HeaderMenuItem>
              <HeaderMenuItem element={Link} to="/schemes">
                Schemes
              </HeaderMenuItem>
            </HeaderNavigation>
            <HeaderNavigation
              className="f_secondarylinks_right"
              aria-label="Carbon Tutorial"
            >
            { screenWidth >= 1080 ? desktopSecondaryLinks : <div></div> }
            </HeaderNavigation>
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
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
                    <HeaderMenuItem
                      element={Link}
                      to="/expenditure/details"
                      onClick={onClickSideNavExpand}
                    >
                      Demand Details
                    </HeaderMenuItem>
                    <HeaderMenuItem
                      element={Link}
                      to="/expenditure/tracker"
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
            { screenWidth < 1080 ? mobileSecondaryLinks : <div></div> }
          </Header>
        </div>
      )}
    />
  );
}
export default FHeader1;
