/** @jsx React.DOM */
var React=require('react');
window.React = require('react')
var rundata = require('../rundata/rundata1.js');
var google=window.google;

var App = React.createClass({


  getInitialState: function() {
        return {
            lat: 51.49119,
            lng: -0.256977,
            route: null
        };
  },

  render: function(){

    return (
        <div>
        <div className="jumbotron"><FilterableRunTable rundata={rundata} onRunSelected={this.onRunSelected} /></div>
          <GMap lat={this.state.lat} lng={this.state.lng} rundata={this.state.route}/>
          
        </div> 
      );
  },

  onRunSelected: function(index){
    this.setState({route: rundata[index]})
  }


});


var GMap = React.createClass({

  render: function(){
    return (
            <div className="row">
            <div className="col-lg-12">
            <div id="map-canvas" ref="Map"/>
            </div>
            </div>
      );
  },

  moveMarker: function() {
    var newLatLng = new google.maps.LatLng(this.props.lat, this.props.lng);
    marker.setPosition(newLatLng)
  },

  addRoute: function(rundata){
    var route = this.props.rundata.route;

    var routeCoordinates = [];
      for (var i in route){
        routeCoordinates.push(new google.maps.LatLng(route[i].latitude,route[i].longitude));
      }


    this.runPath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    this.runPath.setMap(this.map);
  },

  componentDidMount: function(){
    this.initialize();
    if (this.props.rundata){
      this.addRoute(this.props.rundata);
    }
  },
  //TODO if runpath exists, remove it
  clearRoute: function(){

  },

  componentDidUpdate: function(){

    this.clearRoute();

    this.map.setCenter(new google.maps.LatLng(this.props.lat, this.props.lng));

    if (this.props.rundata){
      this.addRoute(rundata);
    }
  },

  initialize: function(){
    var styles = [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}];

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});

    var myLatlng = new google.maps.LatLng(this.props.lat, this.props.lng);
    var mapOptions = {
      center: myLatlng,
      zoom: 11,
          mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
          } 
    };
    this.map = new google.maps.Map(this.refs.Map.getDOMNode(), mapOptions);
    this.map.setTilt(45);
    this.map.setHeading(90);

    //Associate the styled map with the MapTypeId and set it to display.
    this.map.mapTypes.set('map_style', styledMap);
    this.map.setMapTypeId('map_style');

    /** this.marker = new google.maps.Marker({
      position: myLatlng,
      map: this.map,
      draggable: true
    }); **/
  }


});


var FilterableRunTable = React.createClass({
    getInitialState: function() {
        return {
            filterText: ''
        };
    },

    handleUserInput: function(filterText) {
        this.setState({
            filterText: filterText
        });
    },

    render: function() {
        return (
            <div className="spacer">
                <SearchBar onUserInput={this.handleUserInput} filterText={this.state.filterText} />
                <RunTable filterText={this.state.filterText} runs={this.props.rundata} onRunSelected={this.props.onRunSelected}/>
            </div>
        );
    }
});




var SearchBar = React.createClass({
    handleChange: function() {
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        );
    },
    render: function() {
        return (
            <div className="row spacer">
              <div className="col-lg-4 col-lg-offset-4">
                <form onSubmit={this.handleSubmit}>
                  <input ref="filterTextInput" value={this.props.filterText} onChange={this.handleChange} type="search" className="form-control" placeholder="Search for a run" />
                </form>
              </div>
            </div>
        );
    }
});

var RunTable = React.createClass({
    render: function() {
      var props = this.props;
      var rows = props.runs
        .filter(function(run){
          return run.name.toLowerCase().indexOf(props.filterText.toLowerCase()) > -1;
        })
        .map(function(run,i){
          var handleClick = function(){
            props.onRunSelected(i);

          }
          return <RunRow key={i} run={run} handleClick={handleClick}/>;
        });


      return (
          <div className="row spacer">
            <div className="col-lg-4 col-lg-offset-4">
              <table width="100%">
                  <thead>
                      <tr>
                          <th>Title</th>
                          <th>Link</th>
                      </tr>
                  </thead>
                  <tbody>{rows}</tbody>
              </table>
            </div>
          </div>
      );
    }
});


var RunRow = React.createClass({
    getInitialState: function() {
        return {
            viewed: false
        };
    },
    handleClick: function(){
      this.setState({viewed: true});
      this.props.handleClick();
    },
    render: function() {
        return (
            <tr>
                <td>{this.props.run.name}</td>
                <td><a  onClick={this.handleClick}>view {this.state.viewed ? '(viewed)' : ''}</a></td>
            </tr>
        );
    }
});

React.renderComponent(<App />, document.getElementById('app'));

