/** @jsx React.DOM */
var React = require('react');
var pkg = require('./package.json');


var exception = null;
try {
    exception=opener.angular.element(opener.document.body).scope().message.failInfo.exception;
} catch (e) {

}

window.exception = exception;
/*

var exception = {class: 'java.lang.RuntimeException', stacktrace: [
    {method: "java.io.FileInputStream.<init>", fileName: "index.js", lineNumber: 10},
    {method: "java.io.FileInputStream.<init>", fileName: "index.js", lineNumber: 12}
], cause: { class: 'java.io.IOException', frames: [
    {method: "java.io.FileInputStream.<init>", fileName: "a.java", lineNumber: 10},
    {method: "java.io.FileInputStream.<init>", fileName: "a.java", lineNumber: 10},
    {method: "java.io.FileInputStream.<init>", fileName: "a.java", lineNumber: 10}

], cause: null}}

*/

EFChainElement = React.createClass({
    getInitialState: function() {
        return {expand: false};
    },
    toggle: function() {
        this.setState( {expand: !this.state.expand});
    },
    render: function() {
        var s = this.props.setter;
        var rows = []
        this.props.ex.stacktrace.forEach(function(f) {
            rows.push(<li>{f.className}::{f.methodName}(<a onClick={function() { s(f); }}>{f.fileName}:{f.lineNumber}</a>)</li>);
        }.bind(this));
        return (
            <span>
                <h3><a onClick={this.toggle}>{this.props.ex.className} ({this.props.ex.message})</a></h3>
                {this.state.expand ?
                    (<ul>{rows}</ul>) : (<ul></ul>)
                }
            </span>

            );
    }
})

function getScriptUrl() {
    try {
        throw new Exception();
    } catch(e) {
        var ee= e.stack.split("\n")[1].match(/\((.*[.]js)(:.*)?\)/)[1];
        return ee;
    }
}

EFChain = React.createClass({
    getInitialState: function() {
        return {img: "#"};
    },
    setter : function(frame) {
        this.setState({img: "http://localhost:8091/?message=" + frame.fileName + ":" + frame.lineNumber})
    },
    render: function() {
        var esrc=getScriptUrl();
        esrc="javascript:(function() {var w = window.open(); var s =w.document.createElement('script'); s.src='"+esrc+"'; w.document.body.appendChild(s); })()";
        var e = this.props.ex;
        var r = [];

        while(e) {
            r.push(<EFChainElement setter={this.setter} ex={e}/>);
            e= e.cause || null;
        }

        if(r.length==0) {
            r.push(<p>Please bookmark this link and open in on Page with Exception <a href={esrc}>EFormat</a></p>)
        }

        return (<span>
            <h1>EFormat</h1>
            {r}
            { /* <div>{this.state.img}</div> */ }
            <img src={this.state.img} width="1" height="1"/>
        </span>);
    }
});


React.renderComponent(
    <EFChain ex={exception}/>
    , document.body);
