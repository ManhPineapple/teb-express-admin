<template>
  <div class="page">
    <div class="page-header">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="skeleton-page__title-and-primary">
              <div class="skeleton-page__title">
                <div
                  class="skeleton-display-text skeleton-display-text--size-large"
                ></div>
              </div>
              <div class="skeleton-page__primary">
                <div
                  class="skeleton-display-text skeleton-display-text--size-large"
                ></div>
              </div>
            </div>
            <div class="skeleton-page__actions">
              <div class="skeleton-page__action" :style="{ width: '87px' }">
                <div class="skeleton-body-text-container">
                  <div class="skeleton-body-text"></div>
                </div>
              </div>
              <div class="skeleton-page__action" :style="{ width: '67px' }">
                <div class="skeleton-body-text-container">
                  <div class="skeleton-body-text"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-md-8">
            <section class="card">
              <div class="card-block">
                <div class="skeleton-body-text-container">
                  <div class="skeleton-body-text"></div>
                  <div class="skeleton-body-text"></div>
                  <div class="skeleton-body-text"></div>
                </div>
              </div>
            </section>
            <div class="section card">
              <div class="card-block">
                <div class="skeleton-text-container">
                  <div
                    class="skeleton-display-text skeleton-display-text--size-small"
                  ></div>
                  <div class="skeleton-body-text-container">
                    <div class="skeleton-body-text"></div>
                    <div class="skeleton-body-text"></div>
                    <div class="skeleton-body-text"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="section card">
              <div class="card-block">
                <div class="skeleton-display-text"></div>
                <div class="skeleton-body-text-container">
                  <div class="skeleton-body-text"></div>
                  <div class="skeleton-body-text"></div>
                  <div class="skeleton-body-text"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="section card">
              <div class="card-block">
                <div class="skeleton-text-container">
                  <div
                    class="skeleton-display-text skeleton-display-text--size-small"
                  ></div>
                  <div class="skeleton-body-text-container">
                    <div class="skeleton-body-text"></div>
                    <div class="skeleton-body-text"></div>
                  </div>
                </div>
              </div>
              <div class="card-block">
                <div class="skeleton-body-text-container">
                  <div class="skeleton-body-text"></div>
                </div>
              </div>
            </div>
            <div class="section card">
              <div class="card-block">
                <div class="skeleton-text-container">
                  <div
                    class="skeleton-display-text skeleton-display-text--size-small"
                  ></div>
                  <div class="skeleton-body-text-container">
                    <div class="skeleton-body-text"></div>
                    <div class="skeleton-body-text"></div>
                  </div>
                </div>
              </div>
              <div class="card-block">
                <div class="skeleton-body-text-container">
                  <div class="skeleton-body-text"></div>
                  <div class="skeleton-body-text"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageDetailLoading',
}
</script>
