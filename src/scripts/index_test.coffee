require(['module1', 'module2'], (module1, module2)->
	module1.run()
	module2.run()
)

$(document).ready ->

	$('#set_cookie_btn').click ->
		$.cookie 'test_cookie', 'Set by JavaScript'
		location.reload()

	$('#clear_cookie_btn').click ->
		$.removeCookie 'test_cookie'
		location.reload()

	$('#submit').click ->
		$.get '/api/sum?a=' + $('#input_a').val() + '&b=' + $('#input_b').val(), (data)->
			if (data.status == 200)
				$('#result_div').html data.sum
			else
				$('#result_div').html 'Error'

