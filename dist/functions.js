"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.preHops = undefined;

var _github = require("./github");

require("babel-polyfill");

var _marked = [reposToContributorsGenerator, usersToReposGenerator].map(regeneratorRuntime.mark);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getUsersByRepo(name) {
	return _github.repos.getContributors(name);
}

function getReposbyUser(opt) {
	return _github.repos.getForUser(opt);
}

function checkIntersection(user1RepoSet, user2Repos) {
	var user2RepoSet = new Set(user2Repos.map(function (repo) {
		return repo.repo_id;
	}));
	var intersection = new Set([].concat(_toConsumableArray(user1RepoSet)).filter(function (x) {
		return user2RepoSet.has(x);
	}));

	return intersection.size !== 0;
}

function reposToContributorsGenerator(repos) {
	var i;
	return regeneratorRuntime.wrap(function reposToContributorsGenerator$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					i = 0;

				case 1:
					if (!(i < repos.length)) {
						_context.next = 7;
						break;
					}

					_context.next = 4;
					return getUsersByRepo(repos[i]);

				case 4:
					i++;
					_context.next = 1;
					break;

				case 7:
				case "end":
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

function usersToReposGenerator(users) {
	var i;
	return regeneratorRuntime.wrap(function usersToReposGenerator$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					i = 0;

				case 1:
					if (!(i < users.length)) {
						_context2.next = 7;
						break;
					}

					_context2.next = 4;
					return getReposbyUser(users[i]);

				case 4:
					i++;
					_context2.next = 1;
					break;

				case 7:
				case "end":
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}

function getHops(user1RepoSet, user2Repos, counter) {
	var _Array$prototype;

	var found = false;
	var reposGenerator = reposToContributorsGenerator(user2Repos.map(function (repo) {
		return { owner: repo.owner, repo: repo.repo };
	}));
	var contributors = reposGenerator.next();
	var reposUserNames = void 0;
	var user2ReposChildren = [];

	while (!contributors.done && !found) {
		counter++;
		reposUserNames = contributors.value.map(function (user) {
			return user.name;
		});
		var usersGenerator = usersToReposGenerator(reposUserNames);
		var _repos = usersGenerator.next();

		while (!_repos.done && !found) {
			if (_repos.value != "undefined") user2ReposChildren.push(_repos.value);
			found = checkIntersection(user1RepoSet, _repos.value);
			_repos = usersGenerator.next();
		}

		contributors = reposGenerator.next();
	}
	if (found) return counter;

	return getHops(user1RepoSet, (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, user2ReposChildren), counter);
}

function preHops(user1, user2) {
	var user1Repos = getReposbyUser(user1);
	var user2Repos = getReposbyUser(user2);

	var user1ReposSet = new Set(user1Repos.map(function (repo) {
		return repo.repo_id;
	}));
	if (checkIntersection(user1ReposSet, user2Repos)) return 1;

	return getHops(user1ReposSet, user2Repos, 1);
}

exports.preHops = preHops;
//# sourceMappingURL=functions.js.map