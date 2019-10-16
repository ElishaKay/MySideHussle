import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';
import { Link } from 'react-router-dom';

class Profiles extends Component {
  constructor(props) {
      super(props);

      this.state = {
          "pager":
              {"totalItems":150,
                "currentPage":1,
                "pageSize":10,
                "totalPages":15,
                "startPage":1,
                "endPage":10,
                "startIndex":0,
                "endIndex":9,
              "pages":[
                 1,
                 2,
                 3,
                 4,
                 5,
                 6,
                 7,
                 8,
                 9,
                 10
              ]}
      };
  }

      // this.handlePagination = this.handlePagination.bind(this);

  componentDidMount() {
    this.props.getProfiles();
  }

  // handlePagination(){
  //   const params = new URLSearchParams(location.search);
  //   const page = parseInt(params.get('page')) || 1;
  //   if (page !== this.state.pager.currentPage) {
  //       fetch(`/api/items?page=${page}`, { method: 'GET' })
  //           .then(response => response.json())
  //           .then(({pager, pageOfItems}) => {
  //               this.setState({ pager, pageOfItems });
  //           });
  //   }
  // }

  render() {
    let { profiles, loading } = this.props.profile;
    const { pager } = this.state;
    let profileItems;

    

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.slice(pager.startIndex, pager.endIndex + 1).map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ));
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Hussler Profiles</h1>
              <p className="lead text-center">
                Browse and connect with Husslers
              </p>
              {profileItems}
            </div>
          </div>
        </div>

         <div className="card-footer pb-0 pt-3">
            {profileItems.length &&
                <ul className="pagination">
                    <li className={`page-item first-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                        <Link to={{ search: `?page=1` }} className="page-link">First</Link>
                    </li>
                    <li className={`page-item previous-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                        <Link to={{ search: `?page=${pager.currentPage - 1}` }} className="page-link">Previous</Link>
                    </li>
                    {pager.pages.map(page =>
                        <center><li key={page} className={`page-item number-item ${pager.currentPage === page ? 'active' : ''}`}>
                            <Link to={{ search: `?page=${page}` }} className="page-link">{page}</Link>
                        </li></center>
                    )}
                    <li className={`page-item next-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                        <Link to={{ search: `?page=${pager.currentPage + 1}` }} className="page-link">Next</Link>
                    </li>
                    <li className={`page-item last-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                        <Link to={{ search: `?page=${pager.totalPages}` }} className="page-link">Last</Link>
                    </li>
                </ul>
            }                    
        </div>

      </div>

     
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
