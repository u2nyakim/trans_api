
;(function (a) {
  var c = a(".validate-input .input100");
  a(".validate-form").on("submit", function () {
    var f = true;
    for (var g = 0; g < c.length; g++) {
      if (e(c[g]) == false) {
        d(c[g]);
        f = false
      }
    }
    return f
  });
  a(".validate-form .input100").each(function () {
    a(this).focus(function () {
      b(this)
    })
  });

  function e(f) {
    if (a(f).attr("type") == "email" || a(f).attr("name") == "email") {
      if (a(f).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false
      }
    } else {
      if (a(f).val().trim() == "") {
        return false
      }
    }
  }

  function d(f) {
    var g = a(f).parent();
    a(g).addClass("alert-validate")
  }

  function b(f) {
    var g = a(f).parent();
    a(g).removeClass("alert-validate")
  }
})(jQuery);

;
