export default () => `
<section class="home-jumbotron">
<div class="completion-container">
  <h1>Congratulations!</h1>
  <div class="completion-text">
    <p>You've completed the 2021 Crossroads Volunteer Handbook and are now ready for an exciting start as a Volunteer at a domestic violence shelter! <br><br> Please fill out the form below and submit to inform your Volunteer Coordinator.</p>
  </div>
  <form class="contact-form" action="https://formspree.io/f/xyylnwpn" method="POST">
    <label for="fname">Name</label>
    <input type="text" id="fname" name="name" placeholder="Your name..">
    <label for="message">Feedback</label>
    <textarea name="message" placeholder="How was the Handbook?" max-length="200"></textarea>
    <label for="message">Suggestions</label>
    <textarea name="message" placeholder="What could we have done better?" max-length="200"></textarea>
    <label for="rating">Rating</label>
    <div id="star-description">
      <p><i>*1 Star = helpful<i></p>
      <p><i>*5 Stars = extremely helpful<i></p>
    </div>
    <div class="star-rating">
      <div class="star-input">
        <input type="radio" name="rating" id="rating-5">
        <label for="rating-5" class="fas fa-star"></label>
        <input type="radio" name="rating" id="rating-4">
        <label for="rating-4" class="fas fa-star"></label>
        <input type="radio" name="rating" id="rating-3">
        <label for="rating-3" class="fas fa-star"></label>
        <input type="radio" name="rating" id="rating-2">
        <label for="rating-2" class="fas fa-star"></label>
        <input type="radio" name="rating" id="rating-1">
        <label for="rating-1" class="fas fa-star"></label>
      </div>
    </div>
    <input id="completion-submit" type="submit" target="_blank" value="Submit">
  </form>
</div>
</section>
`;
