import React from 'react';
import { NavLink } from 'react-router-dom';

const MemberLeft = () => {
   
    return (
        <div className="col-sm-3">
            <div className="left-sidebar">
                <h2>Account</h2>

                <div className="panel-group category-products">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <NavLink to="/account">
                                    Account
                                </NavLink>
                            </h4>
                        </div>
                    </div>

                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <NavLink to="/my-product">
                                    My Product
                                </NavLink>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberLeft;