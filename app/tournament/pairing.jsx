import React from 'react';
import {render} from 'react-dom';
import UserResults from "./table.jsx";
/*import Loading from "./../tasks/Loading.jsx";
import BreadCumbs from "./BreadCumbs.jsx";

import UserTable from "./UserTable.jsx";
import Tabs from "./Tabs.jsx";*/

class Pairing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pairs: pairing,
            participants: participants,
            scores_object: scores_object,
            tournament_id: tournament_id,
            current_tour: current_tour,
            user_pairs: [],
            user_id: [],
            owner: window.owner,
        }
        this.saveResult = this.saveResult.bind(this);
    }
    componentDidMount(){
        var that = this;

        $("#next_tour").on("click", function () {
            $.ajax({
                url: "/tournament/make_draw",
                method: "post",
                timeout : 3000,
                beforeSend : function () {
                    that.setState({
                        request_sent : true,
                    });
                },
                data : {
                    //result : value,
                    tournament_id : that.state.tournament_id
                },
                statusCode: {
                    404: function() {
                        alert( "page not found" );
                    }
                }
            }).done(function (data) {
                if (data.status === "ok") {
                    if (data.updated_tour == null){
                        location.href = "/tournament/" + that.state.tournament_id + "/final";
                    } else {
                        location.href = "/tournament/" + that.state.tournament_id + "/tour/" + data.updated_tour;
                    }
                } else {
                    alert(data.msg);
                }
            }).fail(function ( jqXHR, textStatus ) {
                alert( "Request failed: " + textStatus );
            }).always(function () {
                that.setState({
                    request_sent : false
                });
            });
        });

        $(".participant").on("click", function (event) {
            event.preventDefault();
            var user_id = $(this).attr("data-id");
            that.setState({
                user_id : user_id
            });
            $.ajax({
                url: "/tournament/get_pairs",
                method: "post",
                timeout : 3000,
                beforeSend : function () {
                    that.setState({
                        request_sent : true,
                    });
                },
                data : {
                    //result : value,
                    tournament_id : that.state.tournament_id,
                    user_id : user_id
                },
                statusCode: {
                    404: function() {
                        alert( "page not found" );
                    }
                }
            }).done(function (data) {
                if (data.status === "ok") {
                     $("#user_results_modal").modal("show");
                    that.setState({
                        user_pairs : data.pairing
                    });
                } else {
                    alert(data.msg);
                }
            }).fail(function ( jqXHR, textStatus ) {
                alert( "Request failed: " + textStatus );
            }).always(function () {
                that.setState({
                    request_sent : false
                });
            });
        });



        $("#delete_all").on("click", function (event) {
            event.preventDefault();
            if (confirm("Вы уверены? Все данные будут удалены.")) {
                $.ajax({
                    url: "/tournament/delete",
                    method: "post",
                    timeout : 3000,
                    beforeSend : function () {
                        that.setState({
                            request_sent : true,
                        });
                    },
                    data : {
                        //result : value,
                        tournament_id : that.state.tournament_id
                    },
                    statusCode: {
                        404: function() {
                            alert( "page not found" );
                        }
                    }
                }).done(function (data) {
                    if (data.status === "ok") {
                        location.reload();
                    } else {
                        alert(data.msg);
                    }
                }).fail(function ( jqXHR, textStatus ) {
                    alert( "Request failed: " + textStatus );
                }).always(function () {
                    that.setState({
                        request_sent : false
                    });
                });
            }
        });



        $(".removeParticipant").on("click",function (event) {
            var user_id = $(this).data("id");
            if (user_id && confirm("Вы уверены? Участник не попадет в следующие жеребьевки.")) {
                $.ajax({
                    url: "/tournament/delete_participant",
                    method: "post",
                    timeout : 3000,
                    beforeSend : function () {
                        that.setState({
                            request_sent : true,
                        });
                    },
                    data : {
                        //result : value,
                        tournament_id : that.state.tournament_id,
                        user_id : user_id,
                    },
                    statusCode: {
                        404: function() {
                            alert( "page not found" );
                        }
                    }
                }).done(function (data) {
                    if (data.status === "ok") {
                        location.reload();
                    } else {
                        alert(data.msg);
                    }
                }).fail(function ( jqXHR, textStatus ) {
                    alert( "Request failed: " + textStatus );
                }).always(function () {
                    that.setState({
                        request_sent : false
                    });
                });
            }

        });


       // this.getUsers(200);
    }
    saveResult(event){

        var that = this;
        var $target = $(event.target);
        var value = event.target.value;

        var val = JSON.parse(value);
        $.ajax({
            url: "/tournament/save_result",
            method: "post",
            timeout : 3000,
            beforeSend : function () {
                that.setState({
                    request_sent : true,
                });
            },
            data : {
                result : value,
                tournament_id : this.state.tournament_id
            },
            statusCode: {
                404: function() {
                    alert( "page not found" );
                }
            }
        }).done(function (data) {
            var $badge = $target.closest("td").find(".badge");

            if (data.status === "ok") {
                $badge.removeClass("hidden").addClass("badge-success").html("сохранено");
            } else {
                $badge.removeClass("hidden").addClass("badge-danger").html("ошибка сохранения");
            }

            var state = that.state.pairs;

            for (var i = 0; i < state.length; i++) {
                var obj = state[i];
                if (obj.p1_id === val.p1_id && obj.p2_id === val.p2_id) {
                    obj.rating_change_p1 = data.rating_change_p1;
                    obj.rating_change_p2 = data.rating_change_p2;
                }
            }

            that.setState({
                pairs: state
            });

            setTimeout(function () {
                $badge.addClass("hidden").removeClass("badge-success badge-error").html("");
            }, 1000);
            /*if (data.users) {
                if (data.users) {
                    that.setState({
                        users : data.users
                    })
                }
            }*/
        }).fail(function ( jqXHR, textStatus ) {
            alert( "Request failed: " + textStatus );
        }).always(function () {
            that.setState({
                request_sent : false
            });
        });
        //console.log(event.target.value);
    }

    render() {

        var w5 = {
            width : "5%"
        };
        var w12 = {
            width : "12%"
        };
        var w30 = {
            width : "36.5%"
        };
        var disabled = {
            disabled : "disabled"
        };
        return (
            <div className="position-relative">


                <table className="table table-hover table-bordered table-sm">
                    <thead className="thead-dark">
                    <tr>
                        <th  scope="col" className="text-center" style={w5}><span className="d-none d-sm-block">Доска</span></th>
                        <th  scope="col" className="text-center hidden-lg-down"  style={w30}>Имя</th>
                        <th  scope="col" className="text-center" style={w5}><span className="d-none d-sm-block">Очки</span></th>
                        <th  scope="col" className="text-center" style={w12}>
                            <span className="d-none d-sm-block">Результат</span>
                            <span className="d-sm-none">Result</span>
                        </th>
                        <th  scope="col" className="text-center hidden-lg-down" style={w5}><span className="d-none d-sm-block">Очки</span></th>
                        <th  scope="col" className="text-center" style={w30}>Имя</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.state.pairs.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center">{index+1}</td>
                            <td data-id={item.p1_id} className="participant">{item.p1_name} <span className="badge badge-dark">{item.p1_rating}</span> {(item.rating_change_p1 > 0) ? <span className="badge badge-success">+{item.rating_change_p1}</span> : <span className="badge badge-danger">{item.rating_change_p1}</span>}</td>
                            <td className="text-center "><span className="d-none d-sm-block">{item.p1_scores}</span></td>
                            <td className="text-center">
                                {(tour_id != "null" && tour_id == current_tour && typeof this.state.owner !== "undefined") ?
                                <select name="" className="custom-select form-control-sm" id="" defaultValue={JSON.stringify({
                                    p1_id:item.p1_id,
                                    p2_id:item.p2_id,
                                    p1_won:item.p1_won,
                                    p2_won:item.p2_won
                                })} {...(!item.p2_id || !item.p1_id) ? disabled : ""} onChange={this.saveResult}>
                                    <option value={JSON.stringify({
                                        p1_id:item.p1_id,
                                        p2_id:item.p2_id,
                                        p1_won:0,
                                        p2_won:0
                                    })}> </option>
                                    <option value={JSON.stringify({
                                        p1_id:item.p1_id,
                                        p2_id:item.p2_id,
                                        p1_won:1,
                                        p2_won:0
                                    })}>1:0</option>
                                    <option value={JSON.stringify({
                                        p1_id:item.p1_id,
                                        p2_id:item.p2_id,
                                        p1_won:0,
                                        p2_won:1
                                    })}>0:1</option>
                                    <option value={JSON.stringify({
                                        p1_id:item.p1_id,
                                        p2_id:item.p2_id,
                                        p1_won:0.5,
                                        p2_won:0.5
                                    })}>½:½</option>
                                </select>
                                : <div>{item.p1_won} - {item.p2_won}</div>}

                                <span className="badge"></span></td>
                            <td className="text-center "><span className="d-none d-sm-block">{item.p2_scores}</span></td>
                            <td data-id={item.p2_id} className="participant">{item.p2_name} <span className="badge badge-dark">{item.p2_rating}</span> {(item.rating_change_p2 > 0) ? <span className="badge badge-success">+{item.rating_change_p2}</span> : <span className="badge badge-danger">{item.rating_change_p2}</span>}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>


                <div className="modal" id="user_results_modal" tabIndex="-1" role="dialog"  aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel"></h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body" id="user_results">
                                <UserResults user_id={this.state.user_id} user_pairs={this.state.user_pairs}/>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        );

    }
}

render(
    <Pairing/>
    , document.getElementById('pairing'));
