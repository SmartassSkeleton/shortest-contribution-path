import { repos } from "./github";
import "babel-polyfill";

function getUsersByRepo(name) {
	return repos.getContributors(name);
}

function getReposbyUser(opt) {
	return repos.getForUser(opt);
}
/**
 * @param  {Set}
 * @param  {Array}
 * @return {boolian}
 *
 * Checks if ther is an intersection between a single user repo list to the other one
 */
function checkIntersection(user1RepoSet, user2Repos) {
	const user2RepoSet = new Set(user2Repos.map(repo => repo.repo_id));
	const intersection = new Set(
		[...user1RepoSet].filter(x => user2RepoSet.has(x))
	);

	return intersection.size !== 0;
}

function* reposToContributorsGenerator(repos) {
	for (let i = 0; i < repos.length; i++) {
		yield getUsersByRepo(repos[i]);
	}
}

function* usersToReposGenerator(users) {
	for (let i = 0; i < users.length; i++) {
		yield getReposbyUser(users[i]);
	}
}

/**
 * @param  {Set} Immutabel user 1 set
 * @param  {Array} user2 repos
 * @param  {int} counter for how many hops
 * @return {recursion||int} when connection found the counter is returned otherwise recursion
 */
function getHops(user1RepoSet, user2Repos, counter) {
	let found = false;
	const reposGenerator = reposToContributorsGenerator(
		user2Repos.map(repo => ({ owner: repo.owner, repo: repo.repo })) //map an array of repos and insert in generator
	);
	let contributors = reposGenerator.next();
	let reposUserNames;
	let user2ReposChildren = [];

	while (!contributors.done && !found) {
		counter++;
		reposUserNames = contributors.value.map(user => user.name);
		const usersGenerator = usersToReposGenerator(reposUserNames);
		let repos = usersGenerator.next();

		while (!repos.done && !found) {
			if (repos.value != "undefined") user2ReposChildren.push(repos.value);
			found = checkIntersection(user1RepoSet, repos.value);
			repos = usersGenerator.next();
		}

		contributors = reposGenerator.next();
	}
	if (found) return counter;

	return getHops(
		user1RepoSet,
		Array.prototype.concat(...user2ReposChildren),
		counter
	);
}

/**
 * @param  {string} username1 login
 * @param  {string} username2 login
 * @return {function}
 */
function preHops(user1, user2) {
	const user1Repos = getReposbyUser(user1);
	const user2Repos = getReposbyUser(user2);

	const user1ReposSet = new Set(user1Repos.map(repo => repo.repo_id));
	if (checkIntersection(user1ReposSet, user2Repos)) return 1; //if we found an intersection return :)

	return getHops(user1ReposSet, user2Repos, 1);
}

export { preHops };
