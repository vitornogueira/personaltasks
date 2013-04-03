function MenuController($scope) {
	$scope.user = JSON.parse(localStorage.getItem('user')) || '';

	$scope.menuopen = false;

	window.addEventListener('online', function() {
		console.log('Uhuul, it\'s online!')
	})
	window.addEventListener('offline', function() {
		console.warn('Ops, it\'s offline :(')
	})
}

angular.module('personaltasks', [])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: UserVerifyCtrl,
				templateUrl: 'partials/home.html'
			})
			.when('/:user', {
				templateUrl: 'partials/list.html',
				controller: ListCtrl
			})
			.when('/:user/:projectUrl', {
				templateUrl: 'partials/projects.html',
				controller: ProjectCtrl
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);

function ListCtrl($scope, $routeParams) {
	var apps = JSON.parse(localStorage.getItem('projects')) || [],
		user = JSON.parse(localStorage.getItem('user'));

	if (!user || user.url !== $routeParams.user) {
		window.location = "http://localhost:8080/#/"
		return false;
	}

	for (i in apps) {
		var app = JSON.parse(localStorage.getItem(apps[i].url)),
			q = 0,
			perc = 0;

		console.log(app);

		q = app.reduce(function(count, item) {
			return item.done ? count : count + 1;
		}, 0);

		perc = app.length ? ((app.length - q) * 100) / app.length : 100;

		apps[i].qtdItem = app.length;
		apps[i].last = app.length - q;
		apps[i].perc = Math.floor(perc);
		apps[i].status = app.length ? apps[i].last : 0;

		if (apps[i].perc == 100) apps[i].color = 'green';
		else if (apps[i].perc < 100 && apps[i].perc > 50) apps[i].color = 'blue';
		else apps[i].color = 'red';
	}

	$scope.user = user;
	$scope.projects = apps;

	document.title = "Personal Tasks | " + user.name

	$scope.add = function() {
		var appName = $scope.newText,
			appUrl = appName.replace(/\s+/g, "-").toLowerCase();
			app = {
				name: appName,
				url: appUrl
			}

		apps.push(app);
		localStorage.setItem('projects', JSON.stringify(apps));
		localStorage.setItem(appUrl, JSON.stringify([]));

		window.location = "http://localhost:8080/#/" + user.url + "/" + appUrl
	};

}

function ProjectCtrl($scope, $routeParams) {
	var itemList = JSON.parse(localStorage.getItem($routeParams.projectUrl)) || [],
		projects = JSON.parse(localStorage.getItem('projects')) || [],
		passou = false;

	$scope.projectUrl = $routeParams.projectUrl;
	$scope.items = itemList;

	for (i in projects) {
		if (projects[i].url == $scope.projectUrl) {
			passou = true;
			$scope.projectName = projects[i].name;
		}
	}

	if (!passou) window.location = "http://localhost:8080/#/";

	document.title = "Personal Tasks | " + $scope.projectName

	$scope.add = function() {
		var projects = JSON.parse(localStorage.getItem('projects')) || [],
			appList = [],
			item = {
				text: $scope.newText,
				done: false
			};

		$scope.items.push(item);
		localStorage.setItem($scope.projectUrl, JSON.stringify($scope.items));

		var txtItem = document.getElementById('new-item');
		txtItem.focus()
	};

	$scope.remaining = function() {
		localStorage.setItem($scope.projectUrl, JSON.stringify($scope.items));

		return $scope.items.reduce(function(count, item) {
			return item.done ? count : count + 1;
		}, 0);
	};

	$scope.archive = function() {
		$scope.items = $scope.items.filter(function(item) {
			if (item.done) return false;
			return true;
		}, 0);

		localStorage.setItem($scope.projectName, JSON.stringify($scope.items));
	};

}

function UserVerifyCtrl($scope, $routeParams) {
	var user = JSON.parse(localStorage.getItem('user'));

	if (user) {
		window.location = "http://localhost:8080/#/" + user.url
		document.title = "Personal Tasks | " + user.name
	}

	$scope.add = function() {
		var user = {
			name: $scope.newText,
			url: $scope.newText.toLowerCase(),
		}

		localStorage.setItem('user', JSON.stringify(user));

		window.location = "http://localhost:8080/#/" + user.url
	};

}