const fadeInSections = document.querySelectorAll('.fade-in-section');

const fadeInLeftSections = document.querySelectorAll('.fade-in-left');

const observerOptions = {
    threshold: 0.2 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

fadeInSections.forEach(section => {
    observer.observe(section);
});

fadeInLeftSections.forEach(section => {
    observer.observe(section);
});

document.querySelector('a[href="#about"]').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#about').scrollIntoView({ 
        behavior: 'smooth' 
    });
});
