document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector('.popup-container');
  const slides = document.querySelectorAll('.slide');
  const slidesContainer = document.querySelector('.slides');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const customMessageInput = document.getElementById("customMessage");
  const headerLabel = document.querySelector('.header-label'); // Changed from option-label to match HTML
  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  // Apply background images to individual slides
  slides.forEach(slide => {
    const imageUrl = slide.dataset.image;
    slide.style.backgroundImage = `url(${imageUrl})`;
  });

  function updateSlide() {
    const currentSlide = slides[currentIndex];
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update the header subtitle with the current slide's label
    headerLabel.textContent = currentSlide.dataset.label;
    
    // Show custom message input only for the "custom" slide
    customMessageInput.style.display = (currentSlide.dataset.value === "custom") ? "block" : "none";
  }

  // Load saved settings
  chrome.storage.sync.get(["replacementType", "customMessage"], (data) => {
    if (data.replacementType) {
      const selectedSlide = Array.from(slides).find(slide => slide.dataset.value === data.replacementType);
      if (selectedSlide) {
        currentIndex = Array.from(slides).indexOf(selectedSlide);
        updateSlide();
        if (data.replacementType === "custom") {
          customMessageInput.value = data.customMessage || "";
        }
      }
    } else {
      updateSlide(); // Default to first slide
    }
  });

  // Arrow button navigation
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    updateSlide();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    updateSlide();
  });

  // Mouse drag functionality (single finger or mouse)
  popup.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    slidesContainer.style.transition = 'none';
  });

  popup.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    const movePercentage = (diffX / popup.offsetWidth) * 100;
    slidesContainer.style.transform = `translateX(calc(-${currentIndex * 100}% + ${movePercentage}px))`;
  });

  popup.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    slidesContainer.style.transition = 'transform 0.5s ease';
    const diffX = e.clientX - startX;
    const threshold = popup.offsetWidth / 3;

    if (diffX > threshold) {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    } else if (diffX < -threshold) {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    }
    updateSlide();
  });

  popup.addEventListener('mouseleave', () => {
    if (!isDragging) return;
    isDragging = false;
    slidesContainer.style.transition = 'transform 0.5s ease';
    updateSlide();
  });

  // Touch support (two fingers only)
  popup.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 2) return; // Require two fingers
    isDragging = true;
    startX = e.touches[0].clientX;
    slidesContainer.style.transition = 'none';
  });

  popup.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 2) return;
    const diffX = e.touches[0].clientX - startX;
    const movePercentage = (diffX / popup.offsetWidth) * 100;
    slidesContainer.style.transform = `translateX(calc(-${currentIndex * 100}% + ${movePercentage}px))`;
  });

  popup.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    slidesContainer.style.transition = 'transform 0.5s ease';
    const diffX = e.changedTouches[0].clientX - startX;
    const threshold = popup.offsetWidth / 3;

    if (diffX > threshold) {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
    } else if (diffX < -threshold) {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
    }
    updateSlide();
  });

  // Save on popup click (excluding drag)
  popup.addEventListener('click', (e) => {
    if (isDragging || e.target === customMessageInput || e.target === prevBtn || e.target === nextBtn) return;

    const selectedSlide = slides[currentIndex];
    const selectedType = selectedSlide.dataset.value;
    const customMessage = customMessageInput.value.trim();
    chrome.storage.sync.set({ replacementType: selectedType, customMessage }, () => {
      console.log("Settings saved:", selectedType);
      window.close();
    });
  });

  // Update custom message on input change
  customMessageInput.addEventListener('input', () => {
    const customMessage = customMessageInput.value.trim();
    chrome.storage.sync.set({ replacementType: "custom", customMessage });
  });
});

// Tooltip functionality (unchanged)
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector('.popup-container');
  const tooltip = document.querySelector('.tooltip');

  popup.addEventListener('mousemove', (e) => {
    const rect = popup.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let tooltipTop = y - tooltip.offsetHeight - 10;
    if (tooltipTop < 0) tooltipTop = 0;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${tooltipTop}px`;
    tooltip.style.opacity = "0.95";
  });

  popup.addEventListener('mouseleave', () => {
    tooltip.style.opacity = "0";
  });
});