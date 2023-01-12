---
title: "The power of SvelteJS: building an animated image carousel in <30 lines of code ✨"
description: Let's make a carousel of images that fade between each other, all in 30 lines of code.
image: https://dev-to-uploads.s3.amazonaws.com/i/vy7ymdy80kokmgf0jfx8.png
pubDate: '2020-04-07T20:01:36.550Z'
---

Ah image carousels... the classic web dev conundrum. Back in the dark ages (so like 5 years ago), you'd be reaching for bootstrap faster than you could spell "bower." But now, with all the crazy component-based frameworks at our disposal, we might as well build one with our bare hands.

I've build carousels in a couple settings (React, Angular 1.x, vanilla ES6) with varying degrees of simplicity, but nothing compares to a neat trick I found using [Svelte](https://svelte.dev). I'll start by walking through a solution you can use in any framework you choose, then cover the *super slick* solution I found. This article should help whether you're already using Svelte, or you're considering it for your next web project. Since some Svelte newbies might find themselves here, I'll try to explain any Svelte-isms that pop up. Onwards!

## What we'll be building

Let's see what kind of carousel we're talking here.

![Finished clickable image carousel](https://res.cloudinary.com/bog/image/upload/v1586276527/blog/bog-logo-showdev/ewltvx3yuyguhue7qpi8.gif)

### The behavior we want to see

1. A simple "next" button should show us the next image. We should also wrap around to the beginning when we reach the end of our carousel.

2. Images should fade *between* each other. This means we can't just change the image's `src` everytime we hit "Next." There's a short in-between state where **two images** are showing, one fading out while the other fades in.

3. The animation shouldn't break when we click really fast!

## TLDR 

I get it. You're excited and what to copy / paste some working code into your project. Well, head over here to see a sandbox of the solution running with a nice browser preview!

You can also skip down to **Using a Svelte-y approach** to understand how this works.

_**Note:** the images may load somewhat slowly. I'm using picsum.photos to generate random images, but they should load faster if you're using static assets in your own project!_

[🚀 Check out the finished REPL](https://svelte.dev/repl/78bee610166a486a9304b9bfbeb77887?version=3.20.1)

## The framework-agnostic approach: flip-flop between image elements

Before jumping into the real Svelte magic, let's see how we'd approach a carousel traditionally. I include this example since it's framework agnostic ([easily made with vanilla JavaScript too!](https://codepen.io/bholmesdev/pen/abOeVMY)), and similar to carousel tutorials you may have seen before. Still, we'll implement the algorithm using Svelte as a demo 🕺

In short, we need to take care of that annoying "in-between" state where two images are showing during the fade animation. Naturally, we should probably add two images to our markup:

```html
<img src="/static/image_1.jpg" />
<img src="/static/image_2.jpg" />
```

Let's also assume we're keeping track of our image carousel URLs in a big JavaScript array. That may look something like this:

```javascript
const carouselImages = [
  '/static/image_1.jpg',
  '/static/image_2.jpg',
  '/static/image_3.jpg'
];
```

Now, we need to figure out the logic to set the image sources correctly every time "Next" is clicked. This can get a little hairy, so let's walk through how our little algorithm will work:

1. The first image element is showing the first image in our array. The second image is hidden.
2. When we click "next," we set the source of the second image to the _next_ image in our array (so image 2). Then, we animate that image into view while the other animates out of view.
3. The second image element is showing the second image in our array. The first image is hidden.
4. When we click "next," we change the first image source from **the first image in the array (index 0)** to the **third image in the array (index 2)** so that it shows the next image in the sequence. In other words, we bump up the index by 2. Then, we animate the first image element into view while the other animates out of view.

... continue the pattern, bumping up the index of the *hidden* image by 2 every time it gets displayed.

Here's a visual demonstration of how all that works!

![Visual demo of changing the image source](https://res.cloudinary.com/bog/image/upload/v1586276545/blog/bog-logo-showdev/zehqkroq8cxvudz3xhhm.gif)

### The code

If you've worked with component-based frameworks before, you've probably identified the state variables we need to keep track of: 

- **`firstIndex`** The array index for the first image `src`
- **`secondIndex`** The array index for the second image `src`
- **`showFirst`** A boolean for which image is currently displaying. In this case, `true` means we should show the first image, and `false` for the second

Since this article's all about Svelte, I'll be using that framework to create and update these guys. But don't worry! This should be a pretty easy transition from your current framework of choice.

### Initial setup

```html
<script>
	const carouselPhotos = [
		'https://picsum.photos/300/200?random=1',
		'https://picsum.photos/300/200?random=2',
		'https://picsum.photos/300/200?random=3',
		'https://picsum.photos/300/200?random=4'
	]
	
  // state variables (yes, just regular ole "let" variables!)
	let firstIndex = 0
	let secondIndex = carouselPhotos.length - 1
	let showFirst = true
  
  const next = () => {
		// logic goes here!
	}
</script>

<img src={carouselPhotos[firstIndex]} />
<img src={carouselPhotos[secondIndex]} />
<button on:click={next}>Next!</button>
```

To start, we've created our state variables, carousel `src` URLs, all the markup we'll need, and a simple button click handler to jump to the next image.

Also, notice that `secondIndex` starts at the _end_ of the array. This is because we want our second index to start one image _behind_ our first, so when bump up its index by 2, it becomes the next image in our array. Since we'll be allowing our indices to wrap to the beginning, we'll consider the last image to be the one before our first.

### Show and hide images on click

Now, let's write our handy algorithm using code:

```html
<script>
  ...
  const next = () => {
    if (showFirst) {
      // if the first image is showing, make sure
      // the second image shows the next array element
      secondIndex = (secondIndex + 2) % carouselPhotos.length
    } else {
      // vice versa if the second image is showing
      firstIndex = (firstIndex + 2) % carouselPhotos.length	
    }
    // flip-flop!
    showFirst = !showFirst
  }
</script>
```

That wasn't too bad! Notice how Svelte just lets you manipulate state variables directly without any fancy hooks of "data" objects. Just modify regular ole JS variables, and the UI will *react* ✨

Here's how we can use our variables in the markup:

```html	
...
<style>
  img {
    opacity: 0;
    transition: opacity 0.5s;
  }
  .visible {
		opacity: 1;
	}
</style>

<img class={showFirst ? 'visible' : ''} src={carouselPhotos[firstIndex]} />
<img class={!showFirst ? 'visible' : ''} src={carouselPhotos[secondIndex]} />
```

All we need is a dynamically applied CSS class depending on our `showFirst` variable, and a couple styles to modify the opacity for a nice fade in and out.

### Demos

[🚀 See the full solution running at this REPL](https://svelte.dev/repl/ffb7c5824fbc45319f132d9f2a6823d8?version=3.20.1)

[😎 See the solution using vanilla JS with few modifications!](https://codepen.io/bholmesdev/pen/abOeVMY)

### Cool solution! Is it the best one though?

So in the end, this code is ready-to-use in your project no problem. I have a few complaints with it though:

1. We have to write out two image elements in our markup, which feels a little repetitive. This will get more noticeable as we add more classes, attributes, and inevitable container `<div>`s around each of them.
2. We're using three state variables for one piece of functionality. This may not sound like a lot, but it hurts the readability of our solution a bit. I bet if you stumbled across this code in someone's repository and didn't have shiny GIFs to understand the algorithm, it would be pretty confusing on first sight.

## Using a Svelte-y approach

Now, let's start using some Svelte-specific magic. There's two approaches that I find cleaner than the image flip-flop: one that's pretty readable but a little longer, and another that's *super sleek* with a little added magic.

### Simple array mapping

So you're probably familiar with how to render a list of content to the page, whether that means a `.map`, an `*ngRepeat`, a `v-for`... you name it. You're also probably familiar with conditionally rendering elements with an if statement (`{condition && ...}`, `*ngIf`, `v-if`, etc.). So what can we do with these powers combined?

Well, make an image carousel of course! Let's check out this little chunk of code:

```html
<script>
  ...
  let currentCarouselIndex = 0
  
  const next = () =>
  	currentCarouselIndex = (currentCarouselIndex + 1) % carouselPhotos.length
</script>

{#each carouselPhotos as photo, index}
	{#if index == currentCarouselIndex}
		<img src={photo} />
	{/if}
{/each}
<button on:click={next}>Next!</button>
```

Bam! Now we're iterating over all the photos in the carousel, then only showing the photo matching our current index. This means we only need one state variable total: `currentCarouselIndex`. Thankfully, I don't think I need to explain how Svelte handles for loops and if statements here. It's very readable on its own 😁

But wait, **what about our in-between state?** In most frameworks, the "if" statement doesn't just change the opacity of a given element. Rather, it decides whether that element gets thrown on the page *at all.* So in this case, we'd obliterate the previous image in our carousel before it even has time to fade away! Hm...

### Transitions to the rescue

Luckily, Svelte has a solution for this already included in the library: [**transition directives**](https://svelte.dev/docs#svelte_transition) ✨

At a basic level, here's how they work:

1. When an element first gets thrown onto the page (based on some conditional if statement), it triggers a tiny JavaScript function that animates that element into view.
2. When that element gets removed from the page (based on the same conditional), it triggers another tiny JavaScript function to animate that element out of view. Then, *only once this animation finishes*, the element gets removed from the document entirely.

This lets us support the in-between state only when we need it! Here's a transition directive in action:

```html
<script>
	import { fade } from 'svelte/transition'
  ...
</script>

{#each carouselPhotos as photo, index}
	{#if index == currentCarouselIndex}
		<img transition:fade src={photo} />
	{/if}
{/each}
```

That's it! All we have to do is import the transition we want to use and apply it to our image. Then, let Svelte handle the JavaScript for us to add and remove elements at the appropriate time.

Here's a new visualization of what's going on:

![Visual of swapping images with array mapping](https://res.cloudinary.com/bog/image/upload/v1586276561/blog/bog-logo-showdev/rpimrrgvbhwhsv9btbee.gif)



And yes, you can customize the transition to your heart's content. Svelte has [a great tutorial series on everything you can do with transitions](https://svelte.dev/tutorial/transition). It's a little tricky to master, but you'll see that it's just as powerful as CSS transitions and keyframes!

In the end, this is my favorite solution. But I bet we can do it with even fewer lines of code...

### Modification: The array key trick

_**Note:** kudos to the incredible [Rishov Sarkar](https://github.com/ArkaneMoose) for finding this trick!_

Yes, our solution is nice and readable, but it feels kinda silly to iterate over *all* the photos in our carousel just to pick out 1 image to render. Ideally, we want to tell Svelte that each image is unique, and we should animate between them whenever the `src` changes.

Luckily, there *is* such a way to uniquely identify each image: **keys**

We now know that transitions will trigger based on a conditional. But according to the [Svelte docs]( https://svelte.dev/docs#animate_fn): "An animation is (also) triggered when the contents of a [keyed each block](https://svelte.dev/docs#each) are re-ordered." This is meant to help with, say, simple todo applications, where you might want to animate-in newly added list elements. As long as you apply a "key" to each element in the list (similar to the `key` prop in React), Svelte will know which elements are "new" between renders.

So how can we apply this to our carousel? Let me throw the solution at you:

```html
... everything from the last solution

{#each [carouselPhotos[currentCarouselIndex]] as photo (currentCarouselIndex)}
		<img transition:fade src={photo} />
{/each}
```

### Woah! What did we just change?

1. Most importantly / weirdly, we're now iterating over an array with *only one element.* In this case, we're creating an array containing just the photo at our current index.
2. We add `(currentCarouselIndex)` to the end of our `#each` statement to assign a "key" to each item in our array. We  know that the index is a unique identifier for items in our array of photos, so we can use it as the key for our image element. Since there's only one element in the array total, we can use our state variable as the unique indentifier.
3. We remove our conditional statement, since Svelte already knows the image is unique based on our key!

This feels a little strange on the surface, but it's actually quite simple. At the start, we have an array of one element: the first photo with a "key" of 0 (our current index). When we hit "next," we transition from showing `[carouselPhotos[0] (key 0)]` to `[carouselPhotos[1] (key 1)]`. To us, it looks like we created an entirely new array. But from Svelte's perspective, it looks like we *removed* the first photo from our array (key 0) and *added* the second photo at the same time (key 1). So, it applies a fade out for what we "removed" and a fade in for what we "added."

So, we took our already short-and-sweet solution and made it even shorter / sweeter 🚀

![noice](https://res.cloudinary.com/bog/image/upload/v1586276568/blog/bog-logo-showdev/s2zkohnytpjiogdvbkbn.gif)

### Demo

Feel free to edit the sandbox code to try out both solutions. Also take a peak at the "JS output" tab in the preview window, which shows you *exactly* what get code is running on the page. In under 200 lines, all of this magic is possible without any hidden libraries or imports 🔥

[🚀 See the full solution running at this REPL](https://svelte.dev/repl/78bee610166a486a9304b9bfbeb77887?version=3.20.1)

## That's it!

In the end, all solutions presented here should be good enough for a production-ready site. But I hope this post taught you some neat tricks that Svelte offers out-of-the-box to create some pretty complex UIs in just a few lines. In the end, our "key trick" solution comes in at under 30 lines of HTML, CSS, and JS *combined!*

We also applied this solution in the real world with great success. Check out [the homepage](https://bitsofgood.org) for the Bits of Good organization, partnering Georgia Tech students with nonprofits to build seriously-useful web apps.

![Bits of Good homepage animation](https://res.cloudinary.com/bog/image/upload/v1586277201/blog/bog-logo-showdev/y6n4ssg0ihc0v9tfjaeh.gif)

You can check out the [source code for this component here](https://github.com/GTBitsOfGood/bog-web/blob/master/src/components/landing/BigLogo.svelte). The markup may be a little hard to read since we're nesting images in a big SVG vector, but you'll notice the "key trick" getting used the same way we just learned 😁

## Before you go: thanks for staying strong

I'm writing this post in the thick of COVID-19 social distancing. You may be a student grieving over missed opportunities or graduations, a mother or father spending too much time with your kids, or a recently unemployed household trying to make ends meet.

This is definitely a difficult time for all of us, but if there's any silver lining, it's all of these online learning opportunities at our disposal. So I'm glad you took the time to give this a read! If you've never used Svelte before, I hope it inspires you to pick it up 😁