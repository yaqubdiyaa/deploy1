<Screen
  id="page1"
  _customShortcuts={[]}
  _hashParams={[]}
  _order={0}
  _searchParams={[]}
  browserTitle=""
  title="Page 1"
  urlSlug=""
  uuid="6c477e97-7deb-4c1a-ba18-abc118e506fe"
>
  <RESTQuery
    id="button1ClickHandler"
    isImported={true}
    notificationDuration={4.5}
    playgroundQueryName="Country Search"
    playgroundQueryUuid="bcaebe33-c5b6-4d27-8c8e-d0ad25de2531"
    queryTimeout="120000"
    resourceDisplayName="dummy api test"
    resourceName="e075d3d1-10dd-4a84-8471-cad10d771e07"
    showSuccessToaster={false}
    streamResponse={true}
  />
  <RESTQuery
    id="button2ClickHandler"
    notificationDuration={4.5}
    resourceDisplayName="dummy api test"
    resourceName="e075d3d1-10dd-4a84-8471-cad10d771e07"
    showSuccessToaster={false}
  />
  <Frame
    id="$main"
    enableFullBleed={false}
    isHiddenOnDesktop={false}
    isHiddenOnMobile={false}
    padding="8px 12px"
    type="main"
  >
    <Button id="button1" text="Button">
      <Event
        id="6f4f373a"
        event="click"
        method="trigger"
        params={{}}
        pluginId="button1ClickHandler"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
    <Button id="button2" text="Button">
      <Event
        id="17e1dd0c"
        event="click"
        method="trigger"
        params={{}}
        pluginId="button2ClickHandler"
        type="datasource"
        waitMs="0"
        waitType="debounce"
      />
    </Button>
  </Frame>
</Screen>
