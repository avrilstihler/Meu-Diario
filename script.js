document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const navItems = document.querySelectorAll('.nav-item');
    const addPostBtnHeader = document.getElementById('add-post-btn-header');

    // New/Edit Post Screen
    const newPostScreen = document.getElementById('screen-new-post');
    const cancelPostBtn = document.getElementById('cancel-post-btn');
    const publishPostBtn = document.getElementById('publish-post-btn');
    const newPostHeaderTitle = document.getElementById('new-post-header-title');
    const newPostText = document.getElementById('new-post-text');
    const newPostAvatar = document.getElementById('new-post-avatar'); // For consistency, could use profile pic
    const addImageBtn = document.getElementById('add-image-btn');
    const newPostImageInput = document.getElementById('new-post-image-input');
    const addVideoBtn = document.getElementById('add-video-btn');
    const newPostVideoUrl = document.getElementById('new-post-video-url');
    const mediaPreviewContainer = document.getElementById('media-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const videoPreviewWrapper = document.getElementById('video-preview-wrapper');
    const removeMediaBtn = document.getElementById('remove-media-btn');
    const editingPostIdInput = document.getElementById('editing-post-id');

    // Diary Screen
    const diaryPostList = document.getElementById('diary-post-list');
    const diaryNoPostsMessage = diaryPostList.querySelector('.no-posts-message');

    // Flashbacks Screen
    const flashbackPostList = document.getElementById('flashback-post-list');
    const flashbackYearFilter = document.getElementById('flashback-year-filter');
    const flashbacksNoPostsMessage = flashbackPostList.querySelector('.no-posts-message');

    // Profile Screen
    const profileScreen = document.getElementById('screen-profile');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profilePicDisplay = document.getElementById('profile-pic-display');
    const profileNameDisplay = document.getElementById('profile-name-display');
    const profileHandleDisplay = document.getElementById('profile-handle-display');
    const profileBioDisplay = document.getElementById('profile-bio-display');
    const profileJoinedDateDisplay = document.getElementById('profile-joined-date-display');
    const profileStatPosts = document.getElementById('profile-stat-posts');
    const profileStatDiaryDays = document.getElementById('profile-stat-diary-days');
    const myDiaryJourneyLink = document.getElementById('my-diary-journey-link');
    const favoriteMemoriesLink = document.getElementById('favorite-memories-link');

    // Edit Profile Screen
    const editProfileScreen = document.getElementById('screen-edit-profile');
    const cancelEditProfileBtn = document.getElementById('cancel-edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const editProfilePicUrlInput = document.getElementById('edit-profile-pic-url');
    const editProfileNameInput = document.getElementById('edit-profile-name');
    const editProfileHandleInput = document.getElementById('edit-profile-handle');
    const editProfileBioInput = document.getElementById('edit-profile-bio');

    // Favorites Screen
    const favoritePostList = document.getElementById('favorite-post-list');
    const favoritesNoPostsMessage = favoritePostList.querySelector('.no-posts-message');

    // Current Year Screen
    const currentYearPostList = document.getElementById('current-year-post-list');
    const currentYearNoPostsMessage = currentYearPostList.querySelector('.no-posts-message');

    const backToProfileBtns = document.querySelectorAll('.back-to-profile-btn');


    // Delete Modal
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    // --- State Variables ---
    let posts = [];
    let profile = {
        name: 'Usuário',
        handle: '@usuario',
        bio: 'Edite seu perfil para adicionar uma bio.',
        picUrl: 'https://via.placeholder.com/100?text=U',
        joinedDate: null // Will be set by the first post's date
    };
    let currentPostToDeleteId = null;
    let currentImageBase64 = null;
    let previousScreenId = 'screen-diary';

    // --- LocalStorage Functions ---
    const LS_POSTS_KEY = 'diaryAppPosts_v2';
    const LS_PROFILE_KEY = 'diaryAppProfile_v2';

    function loadDataFromLocalStorage() {
        const storedPosts = localStorage.getItem(LS_POSTS_KEY);
        if (storedPosts) {
            posts = JSON.parse(storedPosts);
        }
        const storedProfile = localStorage.getItem(LS_PROFILE_KEY);
        if (storedProfile) {
            profile = JSON.parse(storedProfile);
        }
    }

    function saveDataToLocalStorage() {
        localStorage.setItem(LS_POSTS_KEY, JSON.stringify(posts));
        localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
    }

    // --- Utility Functions ---
    function formatDate(isoString) {
        if (!isoString) return 'Data desconhecida';
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    
    function formatRelativeTime(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Agora mesmo';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Há ${diffInMinutes} min`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `Há ${diffInHours}h`;
        // For older posts, show the date
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });

    }

    function getYouTubeEmbedUrl(url) {
        if (!url) return null;
        let videoId = null;
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    // --- Screen Management ---
    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) activeScreen.classList.add('active');

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenId) {
                item.classList.add('active');
            }
        });
         // If opening "new post" via main nav, it should be active. If via header "+", it will be handled
        if (screenId === 'screen-new-post') {
            const newPostNavItem = document.querySelector('.nav-item[data-screen="screen-new-post"]');
            if (newPostNavItem) newPostNavItem.classList.add('active');
        }

        // Hide edit profile screen if navigating away from it without saving/cancelling
        if (screenId !== 'screen-edit-profile' && editProfileScreen.classList.contains('active')) {
            editProfileScreen.classList.remove('active');
        }
    }

    // --- Rendering Functions ---
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-item';
        postDiv.dataset.postId = post.id;

        let mediaHTML = '';
        if (post.image) {
            mediaHTML = `<div class="post-media"><img src="${post.image}" alt="Post image"></div>`;
        } else if (post.videoUrl) {
            const embedUrl = getYouTubeEmbedUrl(post.videoUrl);
            if (embedUrl) {
                mediaHTML = `<div class="post-media"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
            } else {
                 mediaHTML = `<div class="post-media"><p><small>Link de vídeo inválido ou não suportado.</small></p></div>`;
            }
        }

        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${profile.picUrl || 'https://via.placeholder.com/40?text=U'}" alt="User Avatar" class="avatar-small">
                <div class="post-author-info">
                    <strong>Você</strong> 
                    <span class="post-time" title="${formatDate(post.timestamp)}">${formatRelativeTime(post.timestamp)}</span>
                </div>
            </div>
            <p class="post-text">${post.text.replace(/\n/g, '<br>')}</p>
            ${mediaHTML}
            <div class="post-actions">
                <button class="favorite-btn ${post.isFavorite ? 'favorited' : ''}" aria-label="Favoritar">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="post-item-options">
                    <button class="edit-post-btn icon-button" aria-label="Editar Postagem"><i class="fas fa-edit"></i></button>
                    <button class="delete-post-btn icon-button" aria-label="Excluir Postagem"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        // Add event listeners for this specific post
        postDiv.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(post.id));
        postDiv.querySelector('.edit-post-btn').addEventListener('click', () => startEditPost(post.id));
        postDiv.querySelector('.delete-post-btn').addEventListener('click', () => confirmDeletePost(post.id));

        return postDiv;
    }

    function renderPosts(container, postsToRender, noPostsMessageElement) {
        container.innerHTML = ''; // Clear existing posts
        if (postsToRender.length === 0) {
            if (noPostsMessageElement) noPostsMessageElement.style.display = 'block';
        } else {
            if (noPostsMessageElement) noPostsMessageElement.style.display = 'none';
            postsToRender.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
            postsToRender.forEach(post => {
                container.appendChild(createPostElement(post));
            });
        }
    }

    function renderDiaryPosts() {
        renderPosts(diaryPostList, posts, diaryNoPostsMessage);
    }

    function renderFlashbackPosts() {
        const selectedYear = flashbackYearFilter.value;
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const flashbackPosts = posts.filter(post => {
            const postDate = new Date(post.timestamp);
            if (selectedYear === "all") {
                return postDate <= oneYearAgo;
            } else {
                return postDate.getFullYear() == selectedYear;
            }
        });
        renderPosts(flashbackPostList, flashbackPosts, flashbacksNoPostsMessage);
        populateFlashbackYearFilter();
    }
    
    function populateFlashbackYearFilter() {
        const currentFilterValue = flashbackYearFilter.value;
        // Clear existing options except the default
        while (flashbackYearFilter.options.length > 1) {
            flashbackYearFilter.remove(1);
        }

        const yearsInPosts = [...new Set(posts.map(post => new Date(post.timestamp).getFullYear()))].sort((a,b) => b-a);
        yearsInPosts.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            flashbackYearFilter.appendChild(option);
        });
        // Restore previous selection if still valid
        if (yearsInPosts.includes(parseInt(currentFilterValue)) || currentFilterValue === "all") {
            flashbackYearFilter.value = currentFilterValue;
        } else if (yearsInPosts.length > 0) {
             flashbackYearFilter.value = "all"; // Default if previous selection is no longer valid
        }
    }


    function renderFavoritePosts() {
        const favoritePosts = posts.filter(post => post.isFavorite);
        renderPosts(favoritePostList, favoritePosts, favoritesNoPostsMessage);
    }

    function renderCurrentYearPosts() {
        const currentYear = new Date().getFullYear();
        const currentYearPostsData = posts.filter(post => new Date(post.timestamp).getFullYear() === currentYear);
        renderPosts(currentYearPostList, currentYearPostsData, currentYearNoPostsMessage);
    }

    function updateProfileDisplay() {
        profilePicDisplay.src = profile.picUrl || 'https://via.placeholder.com/100?text=U';
        newPostAvatar.src = profile.picUrl || 'https://via.placeholder.com/50?text=Me'; // Update new post avatar too
        profileNameDisplay.textContent = profile.name;
        profileHandleDisplay.textContent = profile.handle;
        profileBioDisplay.textContent = profile.bio;

        // Calculate Stats
        profileStatPosts.textContent = posts.length;

        const uniqueDays = new Set(posts.map(post => new Date(post.timestamp).toDateString()));
        profileStatDiaryDays.textContent = uniqueDays.size;

        // Joined Date (from first post)
        if (posts.length > 0 && !profile.joinedDate) {
            const firstPost = posts.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
            profile.joinedDate = firstPost.timestamp;
            saveDataToLocalStorage(); // Save the joined date once calculated
        }
        profileJoinedDateDisplay.textContent = profile.joinedDate ? `Juntou-se em ${formatDate(profile.joinedDate)}` : 'Nenhuma postagem ainda.';
    }

    // --- Post Actions ---
    function resetNewPostForm() {
        newPostText.value = '';
        newPostVideoUrl.value = '';
        newPostImageInput.value = ''; // Reset file input
        currentImageBase64 = null;
        mediaPreviewContainer.style.display = 'none';
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        videoPreviewWrapper.style.display = 'none';
        videoPreviewWrapper.innerHTML = '';
        removeMediaBtn.style.display = 'none';
        editingPostIdInput.value = '';
        newPostHeaderTitle.textContent = 'Nova Postagem';
        publishPostBtn.textContent = 'Publicar';
    }

    addImageBtn.addEventListener('click', () => newPostImageInput.click());

    newPostImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                currentImageBase64 = e.target.result;
                imagePreview.src = currentImageBase64;
                imagePreview.style.display = 'block';
                videoPreviewWrapper.style.display = 'none';
                videoPreviewWrapper.innerHTML = '';
                newPostVideoUrl.value = ''; // Clear video if image is added
                mediaPreviewContainer.style.display = 'block';
                removeMediaBtn.style.display = 'inline-block';
            }
            reader.readAsDataURL(file);
        }
    });
    
    addVideoBtn.addEventListener('click', () => {
        // This button now just signals intent; user types URL in the visible input.
        // Preview will be shown when URL input changes.
        newPostVideoUrl.focus();
    });

    newPostVideoUrl.addEventListener('input', () => {
        const url = newPostVideoUrl.value.trim();
        const embedUrl = getYouTubeEmbedUrl(url);
        if (embedUrl) {
            videoPreviewWrapper.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
            videoPreviewWrapper.style.display = 'block';
            imagePreview.style.display = 'none';
            imagePreview.src = '#';
            currentImageBase64 = null; // Clear image if video is added
            newPostImageInput.value = '';
            mediaPreviewContainer.style.display = 'block';
            removeMediaBtn.style.display = 'inline-block';
        } else {
            videoPreviewWrapper.style.display = 'none';
            videoPreviewWrapper.innerHTML = '';
            if (url) { // Only show remove if there's text but not a valid embed
                mediaPreviewContainer.style.display = 'block';
                removeMediaBtn.style.display = 'inline-block';
            } else if (!currentImageBase64) { // Hide container if no media
                mediaPreviewContainer.style.display = 'none';
                removeMediaBtn.style.display = 'none';
            }
        }
    });


    removeMediaBtn.addEventListener('click', () => {
        currentImageBase64 = null;
        newPostImageInput.value = '';
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        newPostVideoUrl.value = '';
        videoPreviewWrapper.innerHTML = '';
        videoPreviewWrapper.style.display = 'none';
        mediaPreviewContainer.style.display = 'none';
        removeMediaBtn.style.display = 'none';
    });

    publishPostBtn.addEventListener('click', () => {
        const text = newPostText.value.trim();
        const videoUrl = newPostVideoUrl.value.trim();
        const editingId = editingPostIdInput.value;

        if (!text) {
            alert('Por favor, escreva algo em sua postagem.');
            return;
        }

        if (editingId) { // Editing existing post
            const postIndex = posts.findIndex(p => p.id === editingId);
            if (postIndex > -1) {
                posts[postIndex].text = text;
                posts[postIndex].image = currentImageBase64;
                posts[postIndex].videoUrl = videoUrl && getYouTubeEmbedUrl(videoUrl) ? videoUrl : null; // Store original URL if valid
                 // isFavorite and timestamp remain unchanged
            }
        } else { // Creating new post
            const newPost = {
                id: `post-${Date.now()}`,
                text: text,
                timestamp: new Date().toISOString(),
                image: currentImageBase64,
                videoUrl: videoUrl && getYouTubeEmbedUrl(videoUrl) ? videoUrl : null,
                isFavorite: false,
                author: 'Você' // Or from profile.name
            };
            posts.push(newPost);
            // If this is the first post, set profile joinedDate
            if (posts.length === 1 && !profile.joinedDate) {
                profile.joinedDate = newPost.timestamp;
            }
        }

        saveDataToLocalStorage();
        resetNewPostForm();
        renderAllDynamicContent();
        showScreen(previousScreenId || 'screen-diary'); // Go back to where user came from or diary
    });

    cancelPostBtn.addEventListener('click', () => {
        resetNewPostForm();
        showScreen(previousScreenId || 'screen-diary');
    });


    function startEditPost(postId) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            previousScreenId = document.querySelector('.screen.active').id;
            showScreen('screen-new-post');
            newPostHeaderTitle.textContent = 'Editar Postagem';
            publishPostBtn.textContent = 'Salvar Alterações';
            editingPostIdInput.value = post.id;
            newPostText.value = post.text;

            currentImageBase64 = post.image || null;
            if (post.image) {
                imagePreview.src = post.image;
                imagePreview.style.display = 'block';
                videoPreviewWrapper.style.display = 'none';
                mediaPreviewContainer.style.display = 'block';
                removeMediaBtn.style.display = 'inline-block';
                newPostVideoUrl.value = '';
            } else if (post.videoUrl) {
                newPostVideoUrl.value = post.videoUrl; // Set the input
                const embedUrl = getYouTubeEmbedUrl(post.videoUrl);
                if(embedUrl){
                    videoPreviewWrapper.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
                    videoPreviewWrapper.style.display = 'block';
                }
                imagePreview.style.display = 'none';
                mediaPreviewContainer.style.display = 'block';
                removeMediaBtn.style.display = 'inline-block';
                currentImageBase64 = null;
            } else {
                mediaPreviewContainer.style.display = 'none';
                 removeMediaBtn.style.display = 'none';
            }
        }
    }

    function confirmDeletePost(postId) {
        currentPostToDeleteId = postId;
        deleteConfirmModal.style.display = 'flex';
    }

    confirmDeleteBtn.addEventListener('click', () => {
        if (currentPostToDeleteId) {
            posts = posts.filter(p => p.id !== currentPostToDeleteId);
            saveDataToLocalStorage();
            renderAllDynamicContent(); // Re-render the current view
            // If on a specific post's screen (e.g., an expanded view, not implemented here), navigate away
        }
        deleteConfirmModal.style.display = 'none';
        currentPostToDeleteId = null;
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteConfirmModal.style.display = 'none';
        currentPostToDeleteId = null;
    });

    function toggleFavorite(postId) {
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex > -1) {
            posts[postIndex].isFavorite = !posts[postIndex].isFavorite;
            saveDataToLocalStorage();
            // Re-render the specific post or the whole list for simplicity
            // This depends on which screen is active
            const activeScreenId = document.querySelector('.screen.active').id;
            if (activeScreenId === 'screen-diary') renderDiaryPosts();
            else if (activeScreenId === 'screen-flashbacks') renderFlashbackPosts();
            else if (activeScreenId === 'screen-favorites') renderFavoritePosts();
            else if (activeScreenId === 'screen-current-year') renderCurrentYearPosts();
            // Could also just update the specific heart icon directly for performance
            const postElement = document.querySelector(`.post-item[data-post-id="${postId}"] .favorite-btn`);
            if(postElement) {
                postElement.classList.toggle('favorited', posts[postIndex].isFavorite);
            }
        }
    }

    // --- Profile Editing ---
    editProfileBtn.addEventListener('click', () => {
        editProfilePicUrlInput.value = profile.picUrl;
        editProfileNameInput.value = profile.name;
        editProfileHandleInput.value = profile.handle;
        editProfileBioInput.value = profile.bio;
        
        profileScreen.classList.remove('active');
        editProfileScreen.classList.add('active');
    });

    cancelEditProfileBtn.addEventListener('click', () => {
        editProfileScreen.classList.remove('active');
        profileScreen.classList.add('active');
    });

    saveProfileBtn.addEventListener('click', () => {
        profile.picUrl = editProfilePicUrlInput.value.trim() || 'https://via.placeholder.com/100?text=U';
        profile.name = editProfileNameInput.value.trim() || 'Usuário';
        profile.handle = editProfileHandleInput.value.trim() || '@usuario';
        profile.bio = editProfileBioInput.value.trim() || 'Edite seu perfil para adicionar uma bio.';
        
        saveDataToLocalStorage();
        updateProfileDisplay(); // Update immediately
        renderDiaryPosts(); // Re-render posts as avatar might have changed
        
        editProfileScreen.classList.remove('active');
        profileScreen.classList.add('active');
    });

    // --- Navigation Event Listeners ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetScreenId = item.dataset.screen;
            if (targetScreenId === 'screen-new-post') {
                 // Store where we came from to return after cancel/publish
                previousScreenId = document.querySelector('.screen.active').id || 'screen-diary';
                resetNewPostForm(); // Reset form when opening for a new post
            }
            showScreen(targetScreenId);
            if (targetScreenId === 'screen-flashbacks') renderFlashbackPosts();
            if (targetScreenId === 'screen-profile') updateProfileDisplay();
            // Diary posts are rendered on init and after new post
        });
    });

    addPostBtnHeader.addEventListener('click', () => {
        previousScreenId = 'screen-diary';
        resetNewPostForm();
        showScreen('screen-new-post');
    });
    
    flashbackYearFilter.addEventListener('change', renderFlashbackPosts);

    myDiaryJourneyLink.addEventListener('click', () => {
        renderCurrentYearPosts();
        showScreen('screen-current-year');
    });

    favoriteMemoriesLink.addEventListener('click', () => {
        renderFavoritePosts();
        showScreen('screen-favorites');
    });
    
    backToProfileBtns.forEach(btn => {
        btn.addEventListener('click', () => showScreen('screen-profile'));
    });


    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === deleteConfirmModal) {
            deleteConfirmModal.style.display = 'none';
            currentPostToDeleteId = null;
        }
    });

    // --- Initial Load ---
    function renderAllDynamicContent() {
        // This function can be called to refresh views based on current screen or all
        const currentActiveScreen = document.querySelector('.screen.active');
        renderDiaryPosts(); // Always update diary in case of new posts
        if (currentActiveScreen) {
            if (currentActiveScreen.id === 'screen-flashbacks') renderFlashbackPosts();
            if (currentActiveScreen.id === 'screen-favorites') renderFavoritePosts();
            if (currentActiveScreen.id === 'screen-current-year') renderCurrentYearPosts();
        }
        updateProfileDisplay();
        populateFlashbackYearFilter(); // Make sure filter is up-to-date
    }

    loadDataFromLocalStorage();
    renderAllDynamicContent(); // Initial render of everything
    showScreen('screen-diary'); // Default screen

});