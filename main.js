$("#add").click(function() {
    let text = $("#ing").val();
    console.log(text);
    let li = $('<li/>');
    li.append("<span>" + text + "</span>");
    console.log(li);
    $("#ingredients").append(li);
});

