---
layout: ReadArticle
title: Using Markdown for blogging on AspNet Core
subtitle: Seperate content from rendering
description: Learn about the EarthML vision
date: 2016-10-03 3:07 AM
alias: /2016/10/03/markdown-blogging-on-aspnet-core/
author:
  name: Poul K. Sørensen
  mail: poul@earthml.com
  url: https://twitter.com/pksorensen
  avatar: https://s.gravatar.com/avatar/9003d0ada00ae43a199d7a5fa1be7714?s=80
design:
  bg_color: "#0D3483"
  image: https://cdn.auth0.com/blog/authenticate-linkedin-aspnetcore/logo.png
tags:
- Markdown
- AspNet core
---

- [ ] Check how code is rendered
- [ ] Check how task list is rendered
- [ ] Finalize section on Git History, example code and links to repository code
- [ ] Finalize the post, proof read.

# Using Markdown for blogging on AspNet Core

Many of the small projects that i work on in my spare time often evolve around optimizing the experience or process while getting things done. For me this is a very meditating way of working with code compared with the daily work where focus often is the opposite: *Deliver the most value per time unit*. A coworker of mine and I has started to use the phrase - "Where is the time machine?" for when something new and shiny pops under our radar, meaning we need more time to play with all the technology we are exposed to.

This little project in one of those. I have not blogged since i changed jobs two and a half year ago, which is something i regred and therefore i decided to start blogging again as of now with a goal of delivering 52 blog posts oer the next year.

## Blog Engine

To deliver 52 blog posts the coming year, i simply needed something that allowed me to be productive and no hassle in authoring/publishing blog posts. I used a few weekends to create the EarthML website and another weekend on this blogging engine.

I know people that would slap me for starting to roll my own stuff instead of using something else - but to me I could have used the same or more time finding the system that satified my needs. Then comes the limitations when it dont do exactly what I want and again I end up using more time on making some thing work rather than deliering my 52 blog posts.

So, heres my very oppinionated blogging engine that will evolve over the course of these blog posts to satisfy my needs and hopefully some of the blog posts will be about updating it.

## Markdown

It took me a while when I first started to learn LaTex at DTU, and even more time to understand why separatig content from rendering is cool - but i am there now. While LaTex was cool, Markdown or Restructured Text provides a much more frindly writing experience. Markdown is such a integrated format in much of my work, that i choose that over Restructured Text.

If i had choosen to pick an existing tool/pipeline I most likely had ended up with something that generated a static website - and while it has alot of benefits I do favor having a real website underneeth. Since i havent really started using AspNet Core for anything important, this seemed to be a good project to start learning it on.

While I have picked Markdown to be the format I write my content in, its to early to tell if is a good chooice.

## Visual Studio Team Services
I have been using VSTS for years now and its still one of those projects that I really admire - not only from a user perspective, but also from a developer standpoint when i look at how they designed for extensibility. I draw much inspiration from their decisision.

I mentioned that authoring and publishing should be easy. This is where VSTS will come into play - as i will be keeping work that are in progress in seperate branches and use pull requests as a solution for publishing.

I recently announced my hack on C# Tasks for VSTS, and using my SDK I have made some tasks that allows me to publish each pull request as part of branch policies in VSTS to its seperate url endpoint for visual inspection and accepting the pull request will publish the blog post. Another task is the BuildInfo task that adds a buildinfo.json that the application can use for information about the current build. I am considering that if its a pull request, then the application should require the user to be authorized to view the none published article.

```
2016-10-03T12:57:43.2232107Z {
2016-10-03T12:57:43.2232107Z   "build": {
2016-10-03T12:57:43.2232107Z     "definitionName": "EarthML Website PullRequests",
2016-10-03T12:57:43.2232107Z     "definitionVersion": "4",
2016-10-03T12:57:43.2232107Z     "buildNumber": "20161003.07",
2016-10-03T12:57:43.2232107Z     "buildUri": "vstfs:///Build/Build/692",
2016-10-03T12:57:43.2232107Z     "buildId": "692",
2016-10-03T12:57:43.2232107Z     "queuedBy": "[sinnovations]\\Project Collection Service Accounts",
2016-10-03T12:57:43.2242099Z     "queuedById": "7a58d8c9-b00a-4d68-9178-e6cb329a82b5",
2016-10-03T12:57:43.2242099Z     "requestedFor": "Poul Kjeldager Sorensen",
2016-10-03T12:57:43.2242099Z     "buildRequestedForId": "de20dae1-5312-496d-97b6-43ae3c26ad52",
2016-10-03T12:57:43.2242099Z     "buildSourceVersion": "805ae4f0bd0fef0745d955c6045dc45b9851e742",
2016-10-03T12:57:43.2242099Z     "buildSourceBranch": "refs/pull/6/merge",
2016-10-03T12:57:43.2242099Z     "buildSourceBranchName": "merge",
2016-10-03T12:57:43.2242099Z     "repository": {
2016-10-03T12:57:43.2242099Z       "name": "EarthML.Web.Front",
2016-10-03T12:57:43.2242099Z       "provider": "TfsGit",
2016-10-03T12:57:43.2242099Z       "uri": "https://sinnovations.visualstudio.com/EarthML/_git/EarthML.Web.Front"
2016-10-03T12:57:43.2242099Z     }
2016-10-03T12:57:43.2242099Z   },
2016-10-03T12:57:43.2242099Z   "pullRequest": {
2016-10-03T12:57:43.2242099Z     "repository": {
2016-10-03T12:57:43.2242099Z       "id": "00a7ec50-5571-4309-b548-85636cf2fc33",
2016-10-03T12:57:43.2242099Z       "name": "EarthML.Web.Front",
2016-10-03T12:57:43.2242099Z       "url": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33",
2016-10-03T12:57:43.2242099Z       "project": {
2016-10-03T12:57:43.2242099Z         "id": "c4ea4838-1bed-4dff-801b-4a20b7da1f0a",
2016-10-03T12:57:43.2242099Z         "name": "EarthML",
2016-10-03T12:57:43.2242099Z         "description": "My cool EarthML Project",
2016-10-03T12:57:43.2252095Z         "url": "https://sinnovations.visualstudio.com/_apis/projects/c4ea4838-1bed-4dff-801b-4a20b7da1f0a",
2016-10-03T12:57:43.2252095Z         "state": "wellFormed",
2016-10-03T12:57:43.2252095Z         "revision": 49
2016-10-03T12:57:43.2252095Z       },
2016-10-03T12:57:43.2252095Z       "remoteUrl": "https://sinnovations.visualstudio.com/DefaultCollection/EarthML/_git/EarthML.Web.Front"
2016-10-03T12:57:43.2252095Z     },
2016-10-03T12:57:43.2252095Z     "pullRequestId": 6,
2016-10-03T12:57:43.2252095Z     "codeReviewId": 6,
2016-10-03T12:57:43.2252095Z     "status": "active",
2016-10-03T12:57:43.2252095Z     "createdBy": {
2016-10-03T12:57:43.2252095Z       "id": "de20dae1-5312-496d-97b6-43ae3c26ad52",
2016-10-03T12:57:43.2252095Z       "displayName": "Poul Kjeldager Sorensen",
2016-10-03T12:57:43.2252095Z       "uniqueName": "pks@s-innovations.net",
2016-10-03T12:57:43.2252095Z       "url": "https://app.vssps.visualstudio.com/A43bc9155-597a-42dc-9c12-58c3e170b247/_apis/Identities/de20dae1-5312-496d-97b6-43ae3c26ad52",
2016-10-03T12:57:43.2252095Z       "imageUrl": "https://sinnovations.visualstudio.com/_api/_common/identityImage?id=de20dae1-5312-496d-97b6-43ae3c26ad52"
2016-10-03T12:57:43.2252095Z     },
2016-10-03T12:57:43.2252095Z     "creationDate": "2016-10-03T09:14:04.9297996Z",
2016-10-03T12:57:43.2252095Z     "title": "Abstracted blog engine out",
2016-10-03T12:57:43.2252095Z     "description": " - Abstracted blog engine out",
2016-10-03T12:57:43.2252095Z     "sourceRefName": "refs/heads/Feature/BlogEngine",
2016-10-03T12:57:43.2252095Z     "targetRefName": "refs/heads/master",
2016-10-03T12:57:43.2252095Z     "mergeStatus": "succeeded",
2016-10-03T12:57:43.2252095Z     "mergeId": "7cf36aeb-d1b8-482b-a062-5e350a8340b0",
2016-10-03T12:57:43.2252095Z     "lastMergeSourceCommit": {
2016-10-03T12:57:43.2252095Z       "commitId": "9bc33cc7d154ad01f0e9e4b46825fdad6e3addbd",
2016-10-03T12:57:43.2262178Z       "url": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/commits/9bc33cc7d154ad01f0e9e4b46825fdad6e3addbd"
2016-10-03T12:57:43.2262178Z     },
2016-10-03T12:57:43.2262178Z     "lastMergeTargetCommit": {
2016-10-03T12:57:43.2262178Z       "commitId": "e581dfc4e4e091f93f7a4069c72736c88127a0c8",
2016-10-03T12:57:43.2262178Z       "url": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/commits/e581dfc4e4e091f93f7a4069c72736c88127a0c8"
2016-10-03T12:57:43.2262178Z     },
2016-10-03T12:57:43.2262178Z     "lastMergeCommit": {
2016-10-03T12:57:43.2262178Z       "commitId": "805ae4f0bd0fef0745d955c6045dc45b9851e742",
2016-10-03T12:57:43.2262178Z       "author": {
2016-10-03T12:57:43.2262178Z         "name": "Poul Kjeldager Sorensen",
2016-10-03T12:57:43.2262178Z         "email": "pks@s-innovations.net",
2016-10-03T12:57:43.2262178Z         "date": "2016-10-03T12:54:36Z"
2016-10-03T12:57:43.2262178Z       },
2016-10-03T12:57:43.2262178Z       "committer": {
2016-10-03T12:57:43.2262178Z         "name": "Poul Kjeldager Sorensen",
2016-10-03T12:57:43.2262178Z         "email": "pks@s-innovations.net",
2016-10-03T12:57:43.2262178Z         "date": "2016-10-03T12:54:36Z"
2016-10-03T12:57:43.2262178Z       },
2016-10-03T12:57:43.2262178Z       "comment": "Merge pull request 6 from Feature/BlogEngine into master",
2016-10-03T12:57:43.2262178Z       "url": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/commits/805ae4f0bd0fef0745d955c6045dc45b9851e742"
2016-10-03T12:57:43.2262178Z     },
2016-10-03T12:57:43.2262178Z     "reviewers": [
2016-10-03T12:57:43.2262178Z       {
2016-10-03T12:57:43.2262178Z         "reviewerUrl": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/pullRequests/6/reviewers/86441fed-1c53-44b8-8041-c933ea1223bc",
2016-10-03T12:57:43.2262178Z         "vote": 0,
2016-10-03T12:57:43.2262178Z         "id": "86441fed-1c53-44b8-8041-c933ea1223bc",
2016-10-03T12:57:43.2262178Z         "displayName": "[EarthML]\\EarthML Team",
2016-10-03T12:57:43.2262178Z         "uniqueName": "vstfs:///Classification/TeamProject/c4ea4838-1bed-4dff-801b-4a20b7da1f0a\\EarthML Team",
2016-10-03T12:57:43.2262178Z         "url": "https://app.vssps.visualstudio.com/A43bc9155-597a-42dc-9c12-58c3e170b247/_apis/Identities/86441fed-1c53-44b8-8041-c933ea1223bc",
2016-10-03T12:57:43.2262178Z         "imageUrl": "https://sinnovations.visualstudio.com/_api/_common/identityImage?id=86441fed-1c53-44b8-8041-c933ea1223bc",
2016-10-03T12:57:43.2262178Z         "isContainer": true
2016-10-03T12:57:43.2262178Z       }
2016-10-03T12:57:43.2262178Z     ],
2016-10-03T12:57:43.2262178Z     "url": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/pullRequests/6",
2016-10-03T12:57:43.2262178Z     "_links": {
2016-10-03T12:57:43.2262178Z       "self": {
2016-10-03T12:57:43.2262178Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/pullRequests/6"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "repository": {
2016-10-03T12:57:43.2272095Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "workItems": {
2016-10-03T12:57:43.2272095Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/pullRequests/6/workitems"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "sourceBranch": {
2016-10-03T12:57:43.2272095Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/refs"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "targetBranch": {
2016-10-03T12:57:43.2272095Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/refs"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "sourceCommit": {
2016-10-03T12:57:43.2272095Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/commits/9bc33cc7d154ad01f0e9e4b46825fdad6e3addbd"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "targetCommit": {
2016-10-03T12:57:43.2272095Z         "href": "https://sinnovations.visualstudio.com/_apis/git/repositories/00a7ec50-5571-4309-b548-85636cf2fc33/commits/e581dfc4e4e091f93f7a4069c72736c88127a0c8"
2016-10-03T12:57:43.2272095Z       },
2016-10-03T12:57:43.2272095Z       "createdBy": {
2016-10-03T12:57:43.2272095Z         "href": "https://app.vssps.visualstudio.com/A43bc9155-597a-42dc-9c12-58c3e170b247/_apis/Identities/de20dae1-5312-496d-97b6-43ae3c26ad52"
2016-10-03T12:57:43.2272095Z       }
2016-10-03T12:57:43.2272095Z     },
2016-10-03T12:57:43.2272095Z     "supportsIterations": true
2016-10-03T12:57:43.2272095Z   }
2016-10-03T12:57:43.2272095Z }
```


## Git History
Combining the build info shown above with git history of the article markdown files would allow those that have commited changes to it and has authenticated themself with the site to view the none published post.



